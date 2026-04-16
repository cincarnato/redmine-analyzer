type Primitive = string | number | boolean;
type QueryValue = Primitive | null | undefined;
type QueryParams = Record<string, QueryValue>;
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type RedmineIssueDateField = "created_on" | "closed_on";

interface RedmineProviderOptions {
    timeout?: number;
}

interface RequestOptions {
    params?: QueryParams;
    body?: unknown;
    headers?: Record<string, string>;
}

export class RedmineProviderError extends Error {
    status?: number;
    errors?: unknown;

    constructor(message: string, status?: number, errors?: unknown) {
        super(message);
        this.name = "RedmineProviderError";
        this.status = status;
        this.errors = errors;
    }
}

class RedmineProvider {
    private readonly url: string;
    private readonly apikey: string;
    private readonly defaultProject: string | number;
    private readonly defaultRole: string | number;
    private readonly timeout: number;

    constructor(
        url: string,
        apikey: string,
        defaultProject: string | number,
        defaultRole: string | number,
        options: RedmineProviderOptions = {},
    ) {
        this.url = this.normalizeBaseUrl(url);
        this.apikey = apikey;
        this.defaultProject = defaultProject;
        this.defaultRole = defaultRole;
        this.timeout = options.timeout ?? 5000;
    }

    private normalizeBaseUrl(url: string): string {
        return url.endsWith("/") ? url : `${url}/`;
    }

    private buildUrl(path: string, params?: QueryParams): string {
        const url = new URL(path, this.url);

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value === null || value === undefined || value === "") {
                    continue;
                }
                url.searchParams.set(key, String(value));
            }
        }

        return url.toString();
    }

    private async parseResponse(response: Response): Promise<unknown> {
        if (response.status === 204) {
            return response.status;
        }

        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
            return response.json();
        }

        const text = await response.text();
        return text.length > 0 ? text : response.status;
    }

    private async request<T>(method: RequestMethod, path: string, options: RequestOptions = {}): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(this.buildUrl(path, options.params), {
                method,
                signal: controller.signal,
                headers: {
                    "X-Redmine-API-Key": this.apikey,
                    ...(options.body ? {"Content-Type": "application/json"} : {}),
                    ...options.headers,
                },
                ...(options.body ? {body: JSON.stringify(options.body)} : {}),
            });

            const responseData = await this.parseResponse(response);

            if (!response.ok) {
                const errorPayload = typeof responseData === "object" && responseData !== null ? responseData as Record<string, unknown> : undefined;
                throw new RedmineProviderError(
                    response.statusText || "Redmine request failed",
                    response.status,
                    errorPayload?.errors,
                );
            }

            return responseData as T;
        } catch (error) {
            if (error instanceof RedmineProviderError) {
                throw error;
            }

            if (error instanceof Error && error.name === "AbortError") {
                throw new RedmineProviderError(`Request timeout after ${this.timeout}ms`);
            }

            const message = error instanceof Error ? error.message : "Unknown Redmine request error";
            throw new RedmineProviderError(message);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    private get<T>(path: string, params?: QueryParams, headers?: Record<string, string>): Promise<T> {
        return this.request<T>("GET", path, {params, headers});
    }

    private post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>("POST", path, {body, headers});
    }

    private put<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>("PUT", path, {body, headers});
    }

    private delete<T>(path: string, params?: QueryParams, headers?: Record<string, string>): Promise<T> {
        return this.request<T>("DELETE", path, {params, headers});
    }

    private formatDate(value: unknown) {
        if (!value) {
            return value;
        }

        const date = value instanceof Date ? value : new Date(String(value));
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toISOString().slice(0, 10);
    }

    private mapCustomFields(custom_fields: Array<Record<string, any>> = []) {
        return custom_fields.map((customField) => {
            let value = customField?.value;

            if (customField?.field_format === "date" && value) {
                value = this.formatDate(value);
            }

            return {
                id: customField?.id,
                name: customField?.name,
                value,
            };
        });
    }

    async fetchUsers(offset = 0, limit = 25) {
        return this.get("users.json", {offset, limit, include: "memberships"});
    }

    async findUserById(id: string | number) {
        const result = await this.get<{user?: Record<string, any>}>(
            `users/${id}.json`,
            {offset: 0, limit: 1, include: "memberships"},
        );
        return result.user ?? null;
    }

    async findUserByUsername(username: string) {
        const result = await this.get<{users?: Array<Record<string, any>>}>(
            "users.json",
            {offset: 0, include: "memberships", name: username},
        );

        if (!result.users?.length) {
            return null;
        }

        return result.users.find((user) => user.login === username) ?? null;
    }

    async findUserByEmail(email: string) {
        const result = await this.get<{users?: Array<Record<string, any>>}>(
            "users.json",
            {offset: 0, limit: 1, include: "memberships", name: email},
        );

        return result.users?.length === 1 ? result.users[0] : null;
    }

    async createUser({username, firstname, lastname, mail, password = null}: {
        username: string;
        firstname: string;
        lastname: string;
        mail: string;
        password?: string | null;
    }) {
        const result = await this.post<{user?: Record<string, any>}>("users.json", {
            user: {
                login: username,
                firstname,
                lastname,
                mail,
                ...(password ? {password} : {generate_password: true}),
            },
        });

        return result.user ?? null;
    }

    async deleteUserByid(id: string | number) {
        const result = await this.delete<number>(`users/${id}.json`);
        return result === 204;
    }

    async deleteUserById(id: string | number) {
        return this.deleteUserByid(id);
    }

    async deleteUserByUsername(username: string) {
        const user = await this.findUserByUsername(username);
        if (!user) {
            return false;
        }
        return this.deleteUserByid(user.id);
    }

    async getUserOrCreate(
        {username, firstname, lastname, mail, password = null}: {
            username: string;
            firstname: string;
            lastname: string;
            mail: string;
            password?: string | null;
        },
        projectId?: string | number,
    ) {
        let user = await this.findUserByUsername(username);

        if (!user) {
            user = await this.createUser({username, firstname, lastname, mail, password});
        }

        if (projectId && user?.id) {
            try {
                await this.addProjectMember(projectId, user.id, this.defaultRole);
            } catch (error) {
                console.error("Error adding project member", error);
            }
        }

        return user;
    }

    async fetchProjects(offset = 0, limit = 25) {
        return this.get("projects.json", {
            offset,
            limit,
            include: "trackers,issue_categories,issue_custom_fields",
        });
    }

    async findProjectById(id: string | number) {
        const result = await this.get<{project?: Record<string, any>}>(
            `projects/${id}.json`,
            {offset: 0, limit: 1, include: "trackers,issue_categories,issue_custom_fields"},
        );
        return result.project ?? null;
    }

    async findDefaultProject() {
        const result = await this.get<{project?: Record<string, any>}>(
            `projects/${this.defaultProject}.json`,
            {offset: 0, limit: 1, include: "trackers,issue_categories,issue_custom_fields"},
        );
        return result.project ?? null;
    }

    async findProjectByIdentifier(identifier: string) {
        const result = await this.get<{project?: Record<string, any>}>(
            `projects/${identifier}.json`,
            {offset: 0, limit: 1, include: "trackers,issue_categories,issue_custom_fields"},
        );
        return result.project ?? null;
    }

    async createProject({
        name,
        identifier,
        description,
        homepage,
        status = 1,
        is_public = false,
        inherit_members = false,
    }: {
        name: string;
        identifier: string;
        description?: string;
        homepage?: string;
        status?: number;
        is_public?: boolean;
        inherit_members?: boolean;
    }) {
        const result = await this.post<{project?: Record<string, any>}>("projects.json", {
            project: {
                name,
                identifier: identifier.toLowerCase(),
                description,
                homepage,
                status,
                is_public,
                inherit_members,
            },
        });

        return result.project ?? null;
    }

    async fetchProjectMemberships(projectId: string | number, offset = 0, limit = 25) {
        return this.get(`projects/${projectId}/memberships.json`, {offset, limit});
    }

    async addProjectMember(projectId: string | number, userId: string | number, roleId: string | number) {
        return this.post(`projects/${projectId}/memberships.json`, {
            membership: {
                user_id: userId,
                role_ids: [roleId],
            },
        });
    }

    async getStatusId(status?: string | number | null) {
        if (status === "open" || status === "closed") {
            return status;
        }

        if (!status) {
            return status;
        }

        const statusObj = await this.findIssueStatusesByName(String(status));
        return statusObj?.id ?? status;
    }

    async fetchIssues(offset = 0, limit = 25, orderBy: string | null = null, orderDesc: boolean | null = null, status_id: string | number = "open", tracker_id: string | number | null = null) {
        const resolvedStatusId = await this.getStatusId(status_id);
        return this.get("issues.json", {
            offset,
            limit,
            status_id: resolvedStatusId as QueryValue,
            tracker_id: tracker_id as QueryValue,
            project_id: this.defaultProject as QueryValue,
            include: "journals,relations",
            sort: orderBy ? `${orderBy}${orderDesc ? ":desc" : ""}` : undefined,
        });
    }

    async fetchIssuesByAuthor(author_id: string | number, offset = 0, limit = 25, orderBy: string | null = null, orderDesc: boolean | null = null, status_id: string | number = "open", tracker_id: string | number | null = null) {
        const resolvedStatusId = await this.getStatusId(status_id);
        return this.get("issues.json", {
            offset,
            limit,
            status_id: resolvedStatusId as QueryValue,
            author_id: author_id as QueryValue,
            tracker_id: tracker_id as QueryValue,
            project_id: this.defaultProject as QueryValue,
            include: "journals,relations",
            sort: orderBy ? `${orderBy}${orderDesc ? ":desc" : ""}` : undefined,
        });
    }

    async fetchIssuesByCustomField(author_id: string | number, customField: string | number, customFieldValue: string | number, status_id: string | number = "*", tracker_id: string | number | null = null, offset = 0, limit = 25, orderBy: string | null = null, orderDesc: boolean | null = null) {
        const resolvedStatusId = await this.getStatusId(status_id);
        const params: QueryParams = {
            offset,
            limit,
            author_id: author_id as QueryValue,
            tracker_id: tracker_id as QueryValue,
            status_id: resolvedStatusId as QueryValue,
            project_id: this.defaultProject as QueryValue,
            include: "journals,relations",
            sort: orderBy ? `${orderBy}${orderDesc ? ":desc" : ""}` : undefined,
        };

        params[`cf_${customField}`] = Number.parseInt(String(customFieldValue), 10);

        return this.get("issues.json", params);
    }

    async fetchIssuesByProject(
        projectId: string | number,
        {
            offset = 0,
            limit = 25,
            orderBy = null,
            orderDesc = null,
            status_id = "*",
            tracker_id = null,
            dateField = "closed_on",
            date_from,
            date_to,
        }: {
            offset?: number;
            limit?: number;
            orderBy?: string | null;
            orderDesc?: boolean | null;
            status_id?: string | number;
            tracker_id?: string | number | null;
            dateField?: RedmineIssueDateField;
            date_from?: string | Date | null;
            date_to?: string | Date | null;
        } = {},
    ) {
        const resolvedStatusId = await this.getStatusId(status_id);
        const params: QueryParams = {
            offset,
            limit,
            status_id: resolvedStatusId as QueryValue,
            tracker_id: tracker_id as QueryValue,
            project_id: projectId as QueryValue,
            include: "relations",
            sort: orderBy ? `${orderBy}${orderDesc ? ":desc" : ""}` : undefined,
        };

        const formattedDateFrom = this.formatDate(date_from);
        const formattedDateTo = this.formatDate(date_to);

        if (formattedDateFrom && formattedDateTo) {
            params[dateField] = `><${formattedDateFrom}|${formattedDateTo}`;
        } else if (formattedDateFrom) {
            params[dateField] = `>=${formattedDateFrom}`;
        } else if (formattedDateTo) {
            params[dateField] = `<=${formattedDateTo}`;
        }

        return this.get("issues.json", params);
    }

    async findIssueById(id: string | number) {
        const result = await this.get<{issue?: Record<string, any>}>(`issues/${id}.json?include=journals,relations`, {
            offset: 0,
            limit: 1,
        });

        if (!result.issue) {
            return null;
        }

        if (Array.isArray(result.issue.journals)) {
            result.issue.journals = result.issue.journals.filter((journal: Record<string, any>) => journal.private_notes === false);
        }

        return result.issue;
    }

    async fetchIssueJournals(id: string | number) {
        const result = await this.get<{issue?: Record<string, any>}>(`issues/${id}.json?include=journals`, {
            offset: 0,
            limit: 1,
        });

        if (!result.issue?.journals) {
            return null;
        }

        result.issue.journals = result.issue.journals.filter((journal: Record<string, any>) => journal.private_notes === false);
        return result.issue.journals;
    }

    async createIssue(
        {
            project_id = this.defaultProject,
            tracker_id,
            subject,
            description,
            custom_fields = [],
        }: {
            project_id?: string | number;
            tracker_id: string | number;
            subject: string;
            description?: string;
            custom_fields?: Array<Record<string, any>>;
        },
        user: {username?: string; firstname?: string; lastname?: string; mail?: string},
    ) {
        const {username, firstname, lastname, mail} = user;

        if (username && firstname && lastname && mail) {
            await this.getUserOrCreate({username, firstname, lastname, mail}, project_id);
        }

        const headers: Record<string, string> = {};
        if (username) {
            headers["X-Redmine-Switch-User"] = username;
        }

        const result = await this.post<{issue?: Record<string, any>}>(
            "issues.json",
            {
                issue: {
                    project_id,
                    tracker_id,
                    subject,
                    description,
                    custom_fields: this.mapCustomFields(custom_fields),
                },
            },
            headers,
        );

        return result.issue ?? null;
    }

    async updateIssue(
        id: string | number,
        {
            project_id = this.defaultProject,
            tracker_id,
            status_id,
            subject,
            description,
            notes,
            custom_fields = [],
        }: {
            project_id?: string | number;
            tracker_id?: string | number;
            status_id?: string | number;
            subject?: string;
            description?: string;
            notes?: string;
            custom_fields?: Array<Record<string, any>>;
        },
        user: {username?: string; firstname?: string; lastname?: string; mail?: string},
    ) {
        const {username, firstname, lastname, mail} = user;

        if (username && firstname && lastname && mail) {
            await this.getUserOrCreate({username, firstname, lastname, mail});
        }

        const headers: Record<string, string> = {};
        if (username) {
            headers["X-Redmine-Switch-User"] = username;
        }

        const result = await this.put<{issue?: Record<string, any>}>(
            `issues/${id}.json`,
            {
                issue: {
                    project_id,
                    tracker_id,
                    status_id,
                    subject,
                    notes,
                    description,
                    custom_fields: this.mapCustomFields(custom_fields),
                },
            },
            headers,
        );

        return result.issue ?? null;
    }

    async fetchTracker() {
        const result = await this.get<{trackers?: Array<Record<string, any>>}>("trackers.json");
        return result.trackers ?? [];
    }

    async fetchProjectTrackers(id: string | number) {
        const result = await this.findProjectById(id);
        return result?.trackers ?? null;
    }

    async fetchDefaultProjectTrackers() {
        const result = await this.findProjectById(this.defaultProject);
        return result?.trackers ?? null;
    }

    async findTrackerByName(name: string) {
        const trackers = await this.fetchTracker();
        return trackers.find((tracker) => tracker.name === name) ?? null;
    }

    async findTrackerById(id: string | number) {
        const result = await this.get<{tracker?: Record<string, any>}>(
            `trackers/${id}.json`,
            {offset: 0, limit: 1, id},
        );
        return result.tracker ?? null;
    }

    async createTracker({name, description}: {name: string; description?: string}) {
        const result = await this.post<{tracker?: Record<string, any>}>("trackers.json", {
            project: {
                name,
                description,
            },
        });

        return result.tracker ?? null;
    }

    async fetchCustomFields() {
        return this.get("custom_fields.json");
    }

    async fetchCustomFieldsByTracker(trackerId: string | number) {
        const result = await this.get<{custom_fields?: Array<Record<string, any>>}>(
            "custom_fields.json",
            {tracker_id: trackerId},
        );

        if (result.custom_fields) {
            result.custom_fields = result.custom_fields.filter((customField) =>
                customField.trackers?.some((tracker: Record<string, any>) => tracker.id == trackerId),
            );
        }

        return result;
    }

    async createCustomField({
        name,
        customized_type = "issue",
        field_format,
        regexp,
        min_length,
        max_length,
        is_required,
        is_filter,
        searchable,
        multiple,
        default_value,
        visible,
        trackers,
        roles,
    }: {
        name: string;
        customized_type?: string;
        field_format: string;
        regexp?: string;
        min_length?: number;
        max_length?: number;
        is_required?: boolean;
        is_filter?: boolean;
        searchable?: boolean;
        multiple?: boolean;
        default_value?: string;
        visible?: boolean;
        trackers?: unknown[];
        roles?: unknown[];
    }) {
        const result = await this.post<{custom_field?: Record<string, any>}>("custom_fields.json", {
            project: {
                name,
                customized_type,
                field_format,
                regexp,
                min_length,
                max_length,
                is_required,
                is_filter,
                searchable,
                multiple,
                default_value,
                visible,
                trackers,
                roles,
            },
        });

        return result.custom_field ?? null;
    }

    async fetchIssueStatuses() {
        return this.get<{issue_statuses?: Array<Record<string, any>>}>("issue_statuses.json");
    }

    async findIssueStatusesByName(name: string) {
        const result = await this.fetchIssueStatuses();
        return result.issue_statuses?.find((issueStatus) => issueStatus.name?.includes(name)) ?? null;
    }
}

export default RedmineProvider;
