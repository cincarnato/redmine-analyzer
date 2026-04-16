import {AbstractFastifyController, CustomRequest} from "@drax/crud-back";
import type {FastifyReply} from "fastify";
import type {IDraxFieldFilter} from "@drax/crud-share";
import RedmineIssuePermissions from "../permissions/RedmineIssuePermissions.js";
import RedmineIssueServiceFactory from "../factory/services/RedmineIssueServiceFactory.js";
import RedmineProviderFactory from "../factory/providers/RedmineProviderFactory.js";
import type {IRedmineIssue, IRedmineIssueBase} from "../interfaces/IRedmineIssue";

interface IRedmineProjectOption {
    id: number | string;
    name: string;
    identifier?: string;
}

interface IRedmineStatusOption {
    id: number | string;
    name: string;
    isClosed?: boolean;
}

interface IRedmineProjectListResponse {
    projects?: Array<Record<string, any>>;
    total_count?: number;
    offset?: number;
    limit?: number;
}

interface IRedmineIssueListResponse {
    issues?: Array<Record<string, any>>;
    total_count?: number;
    offset?: number;
    limit?: number;
}

type RedmineIssueDateField = "created_on" | "closed_on";

class RedmineSyncController extends AbstractFastifyController<IRedmineIssue, IRedmineIssueBase, IRedmineIssueBase> {
    private readonly redmineProvider = RedmineProviderFactory.instance;
    private readonly journalFetchBatchSize = 10;

    constructor() {
        super(RedmineIssueServiceFactory.instance, RedmineIssuePermissions);
        this.tenantField = "tenant";
        this.userField = "user";

        this.tenantFilter = false;
        this.tenantSetter = false;
        this.tenantAssert = false;

        this.userFilter = false;
        this.userSetter = false;
        this.userAssert = false;
    }

    private ensureDateRange(dateFrom?: string, dateTo?: string) {
        if (!dateFrom || !dateTo) {
            throw new Error("dateFrom and dateTo are required");
        }

        const from = new Date(dateFrom);
        const to = new Date(dateTo);

        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
            throw new Error("Invalid date range");
        }

        if (from.getTime() > to.getTime()) {
            throw new Error("dateFrom must be less than or equal to dateTo");
        }

        return {
            from,
            to,
        };
    }

    private resolveDateField(dateField?: string): RedmineIssueDateField {
        return dateField === "created_on" ? "created_on" : "closed_on";
    }

    private mapIssue(issue: Record<string, any>): IRedmineIssueBase {
        const fixedVersion = this.mapNamedEntity(issue.fixed_version);
        const journals = Array.isArray(issue.journals)
            ? issue.journals.map((journal: Record<string, any>) => ({
                id: journal.id,
                user: this.mapNamedEntity(journal.user),
                notes: journal.notes,
                createdOn: journal.created_on ? new Date(journal.created_on) : null,
                details: Array.isArray(journal.details)
                    ? journal.details.map((detail: Record<string, any>) => ({
                        property: detail.property != null ? String(detail.property) : undefined,
                        name: detail.name != null ? String(detail.name) : undefined,
                        oldValue: detail.old_value != null ? String(detail.old_value) : undefined,
                        newValue: detail.new_value != null ? String(detail.new_value) : undefined,
                    }))
                    : [],
            }))
            : [];
        const relations = Array.isArray(issue.relations)
            ? issue.relations.map((relation: Record<string, any>) => ({
                id: relation.id,
                issueId: relation.issue_id,
                issueToId: relation.issue_to_id,
                relationType: relation.relation_type != null ? String(relation.relation_type) : undefined,
                delay: typeof relation.delay === "number" ? relation.delay : null,
            }))
            : [];

        return {
            redmineId: issue.id,
            subject: issue.subject,
            description: issue.description,
            doneRatio: issue.done_ratio ?? null,
            isPrivate: issue.is_private ?? false,
            spentHours: issue.spent_hours ?? null,
            totalSpentHours: issue.total_spent_hours ?? null,
            estimatedHours: issue.estimated_hours ?? null,
            totalEstimatedHours: issue.total_estimated_hours ?? null,
            startDate: issue.start_date ? new Date(issue.start_date) : null,
            dueDate: issue.due_date ? new Date(issue.due_date) : null,
            createdOn: new Date(issue.created_on),
            updatedOn: new Date(issue.updated_on),
            closedOn: issue.closed_on ? new Date(issue.closed_on) : null,
            project: {
                id: issue.project?.id,
                name: issue.project?.name,
            },
            tracker: {
                id: issue.tracker?.id,
                name: issue.tracker?.name,
            },
            status: {
                id: issue.status?.id,
                name: issue.status?.name,
                isClosed: issue.status?.is_closed,
            },
            priority: {
                id: issue.priority?.id,
                name: issue.priority?.name,
            },
            author: {
                id: issue.author?.id,
                name: issue.author?.name,
            },
            fixedVersion,
            journals,
            relations,
            customFields: Array.isArray(issue.custom_fields)
                ? issue.custom_fields.map((customField: Record<string, any>) => ({
                    id: customField.id,
                    name: customField.name,
                    value: customField.value != null ? String(customField.value) : undefined,
                }))
                : [],
            syncSource: "redmine",
            rawPayload: issue,
        };
    }

    private mapNamedEntity(entity?: Record<string, any> | null) {
        const id = typeof entity?.id === "number"
            ? entity.id
            : typeof entity?.id === "string" && entity.id.trim() !== ""
                ? Number(entity.id)
                : Number.NaN;
        const name = typeof entity?.name === "string" ? entity.name.trim() : "";

        if (Number.isNaN(id) || name.length === 0) {
            return undefined;
        }

        return {id, name};
    }

    private async resolveStatusFilter(statusIds?: Array<string | number>) {
        if (!Array.isArray(statusIds) || statusIds.length === 0) {
            return "*";
        }

        const resolvedStatuses = await Promise.all(
            statusIds.map((statusId) => this.redmineProvider.getStatusId(statusId)),
        );

        const normalizedStatuses = resolvedStatuses
            .map((statusId) => String(statusId).trim())
            .filter((statusId) => statusId.length > 0);

        if (normalizedStatuses.length === 0) {
            return "*";
        }

        return Array.from(new Set(normalizedStatuses)).join("|");
    }

    private async upsertIssue(data: IRedmineIssueBase) {
        const filters: IDraxFieldFilter[] = [
            {
                field: "redmineId",
                operator: "eq",
                value: data.redmineId,
            },
        ];

        const existing = await this.service.findOne({filters, search: ""}).catch(() => null);

        if (existing) {
            const identifier = existing._id ?? String(existing.redmineId);
            return {
                action: "updated",
                item: await this.service.update(identifier, data),
            };
        }

        return {
            action: "created",
            item: await this.service.create(data),
        };
    }

    private async loadIssuesWithOptionalJournals(
        issues: Array<Record<string, any>>,
        includeJournals: boolean,
    ) {
        if (!includeJournals || issues.length === 0) {
            return issues;
        }

        const itemsWithJournals: Array<Record<string, any>> = [];

        for (let index = 0; index < issues.length; index += this.journalFetchBatchSize) {
            const batch = issues.slice(index, index + this.journalFetchBatchSize);
            const hydratedBatch = await Promise.all(
                batch.map(async (issue) => {
                    const issueId = issue?.id;
                    if (issueId == null) {
                        return issue;
                    }

                    return await this.redmineProvider.findIssueById(issueId) ?? issue;
                }),
            );

            itemsWithJournals.push(...hydratedBatch);
        }

        return itemsWithJournals;
    }

    async getProjects(request: CustomRequest, reply: FastifyReply) {
        try {
            request?.rbac.assertAuthenticated();

            const projects: IRedmineProjectOption[] = [];
            let offset = 0;
            const limit = 100;
            let totalCount = 0;

            do {
                const response = await this.redmineProvider.fetchProjects(offset, limit) as IRedmineProjectListResponse;
                const items = response.projects ?? [];

                projects.push(
                    ...items.map((project) => ({
                        id: project.id,
                        name: project.name,
                        identifier: project.identifier,
                    })),
                );

                totalCount = response.total_count ?? items.length;
                offset += response.limit ?? limit;
            } while (offset < totalCount);

            return projects.sort((a, b) => a.name.localeCompare(b.name));
        } catch (e) {
            this.handleError(e, reply);
        }
    }

    async getIssueStatuses(request: CustomRequest, reply: FastifyReply) {
        try {
            request?.rbac.assertAuthenticated();

            const response = await this.redmineProvider.fetchIssueStatuses() as {
                issue_statuses?: Array<Record<string, any>>;
            };

            const statuses: IRedmineStatusOption[] = (response.issue_statuses ?? []).map((status) => ({
                id: status.id,
                name: status.name,
                isClosed: status.is_closed,
            }));

            return statuses.sort((a, b) => a.name.localeCompare(b.name));
        } catch (e) {
            this.handleError(e, reply);
        }
    }

    async syncProjectIssues(request: CustomRequest, reply: FastifyReply) {
        try {
            request?.rbac.assertAuthenticated();

            const body = (request.body ?? {}) as {
                projectId?: string | number;
                dateFrom?: string;
                dateTo?: string;
                dateField?: RedmineIssueDateField;
                statusIds?: Array<string | number>;
                includeJournals?: boolean;
            };
            const projectId = body.projectId;
            const dateFrom = body.dateFrom;
            const dateTo = body.dateTo;
            const dateField = this.resolveDateField(body.dateField);
            const statusIds = body.statusIds;
            const includeJournals = body.includeJournals === true;

            if (!projectId) {
                reply.statusCode = 400;
                return reply.send({error: "projectId is required"});
            }

            this.ensureDateRange(dateFrom, dateTo);
            const resolvedStatusFilter = await this.resolveStatusFilter(statusIds);

            const issues: Array<Record<string, any>> = [];
            let offset = 0;
            const limit = 100;
            let totalCount = 0;

            do {
                const response = await this.redmineProvider.fetchIssuesByProject(projectId, {
                    offset,
                    limit,
                    status_id: resolvedStatusFilter,
                    orderBy: dateField,
                    dateField,
                    date_from: dateFrom,
                    date_to: dateTo,
                }) as IRedmineIssueListResponse;

                const pageItems = response.issues ?? [];
                issues.push(...pageItems);

                totalCount = response.total_count ?? pageItems.length;
                offset += response.limit ?? limit;
            } while (offset < totalCount);

            const issuesToSync = await this.loadIssuesWithOptionalJournals(issues, includeJournals);

            let created = 0;
            let updated = 0;

            for (const issue of issuesToSync) {
                const result = await this.upsertIssue(this.mapIssue(issue));
                if (result.action === "created") {
                    created += 1;
                } else {
                    updated += 1;
                }
            }

            return {
                projectId,
                dateFrom,
                dateTo,
                dateField,
                statusIds: Array.isArray(statusIds) ? statusIds : [],
                includeJournals,
                total: issuesToSync.length,
                created,
                updated,
            };
        } catch (e) {
            this.handleError(e, reply);
        }
    }
}

export default RedmineSyncController;
export {
    RedmineSyncController,
};
