
import RedmineIssueAnalysisServiceFactory from "../factory/services/RedmineIssueAnalysisServiceFactory.js";
import {AbstractFastifyController, CustomRequest} from "@drax/crud-back";
import RedmineIssueAnalysisPermissions from "../permissions/RedmineIssueAnalysisPermissions.js";
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from "../interfaces/IRedmineIssueAnalysis";
import type {FastifyReply} from "fastify";
import type {IDraxFieldFilter} from "@drax/crud-share";
import {AiProviderFactory} from "@drax/ai-back";
import {z} from "zod";
import RedmineIssueServiceFactory from "../factory/services/RedmineIssueServiceFactory.js";
import type {IRedmineIssue, IRedmineIssueBase} from "../interfaces/IRedmineIssue";

interface IAnalyzeIssuesPayload {
    projectId?: number | string;
    dateFrom?: string;
    dateTo?: string;
    statusIds?: Array<number | string>;
}

interface IAnalyzeIssueError {
    redmineIssueId: string;
    subject: string;
    message: string;
}

interface IAnalyzeIssuesResult {
    projectId: number | string;
    dateFrom: string;
    dateTo: string;
    statusIds: Array<number | string>;
    total: number;
    created: number;
    updated: number;
    failed: number;
    errors: IAnalyzeIssueError[];
}

const RedmineIssueAnalysisPromptSchema = z.object({
    resumen: z.string().nullable(),
    categoria: z.enum([
        'nueva_funcionalidad',
        'error',
        'soporte',
        'mantenimiento',
        'refactorizacion',
        'investigacion',
        'configuracion',
        'documentacion',
        'tarea_tecnica',
        'integracion',
        'optimizacion',
        'seguridad',
        'datos',
        'infraestructura',
        'otro'
    ]).nullable(),
    tipoObjetivo: z.enum([
        'nueva_capacidad',
        'correccion_de_falla',
        'estabilidad',
        'reduccion_de_deuda_tecnica',
        'soporte_operativo',
        'cumplimiento',
        'mejora_experiencia_usuario',
        'reduccion_de_costos',
        'investigacion',
        'automatizacion',
        'escalabilidad',
        'observabilidad',
        'otro'
    ]).nullable(),
    nivelValor: z.enum(['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto']).nullable(),
    nivelComplejidad: z.enum(['muy_baja', 'baja', 'media', 'alta', 'muy_alta']).nullable(),
    nivelUrgencia: z.enum(['muy_baja', 'baja', 'media', 'alta', 'muy_alta']).nullable(),
    nivelDetectabilidadDesarrollo: z.enum(['muy_baja', 'baja', 'alta', 'muy_alta']).nullable(),
    tipoTrabajoTecnico: z.enum(['frontend', 'backend', 'fullstack']).nullable(),
    esError: z.boolean().nullable(),
    esRetrabajo: z.boolean().nullable(),
    esCambioMenor: z.boolean().nullable(),
    estaBloqueado: z.boolean().nullable(),
    motivoRetrabajo: z.enum([
        'correccion_de_error_en_produccion',
        'correccion_de_error_previo_a_produccion',
        'cambio_de_requerimiento',
        'caso_no_contemplado',
        'ajuste_funcional',
        'ajuste_tecnico',
        'refactorizacion_necesaria',
        'problema_de_calidad',
        'problema_de_testing',
        'problema_de_comunicacion',
        'dependencia_externa',
        'desconocido'
    ]).nullable(),
    areasImpacto: z.array(z.enum([
        'backend',
        'frontend',
        'base_de_datos',
        'infraestructura',
        'devops',
        'integraciones',
        'seguridad',
        'experiencia_usuario',
        'datos',
        'reporting',
        'api',
        'arquitectura',
        'testing'
    ])).nullable(),
    grupoObjetivo: z.string().nullable(),
    areaFuncional: z.string().nullable(),
    resultadoProbable: z.enum([
        'valor_directo_para_negocio',
        'mejora_de_calidad',
        'continuidad_operativa',
        'reduccion_de_riesgo',
        'mejora_tecnica_interna',
        'habilitador_para_trabajo_futuro',
        'bajo_valor_visible',
        'sin_valor_claro'
    ]).nullable(),
    senialesDesperdicio: z.array(z.enum([
        'requerimiento_poco_claro',
        'cambio_muy_pequenio',
        'exceso_de_coordinacion',
        'retrabajo',
        'operacion_manual',
        'bajo_impacto_de_negocio',
        'duplicacion_de_esfuerzo',
        'dependencia_evita_avance',
        'analisis_excesivo',
        'espera_prolongada'
    ])).nullable(),
    senialesProceso: z.array(z.enum([
        'buena_definicion',
        'mala_definicion',
        'cambio_de_alcance',
        'demora_por_dependencia',
        'gap_de_testing',
        'resolucion_rapida',
        'estimacion_desviada',
        'prioridad_inestable',
        'falta_de_contexto',
        'buena_colaboracion',
        'alto_ida_y_vuelta'
    ])).nullable(),
    confianza: z.number().min(0).max(1).nullable(),
});

class RedmineIssueAnalysisController extends AbstractFastifyController<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase>   {
    private readonly issueService = RedmineIssueServiceFactory.instance;

    private readonly aiProvider = AiProviderFactory.instance();

    constructor() {
        super(RedmineIssueAnalysisServiceFactory.instance, RedmineIssueAnalysisPermissions)
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

        const fromStart = new Date(from);
        fromStart.setHours(0, 0, 0, 0);

        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);

        return {
            from,
            to,
            fromStart,
            toEnd,
        };
    }

    private normalizeFilterValues(values?: Array<number | string>) {
        if (!Array.isArray(values)) {
            return [];
        }

        return values
            .map((value) => {
                if (typeof value === "number") {
                    return value;
                }

                const trimmedValue = String(value).trim();
                if (trimmedValue.length === 0) {
                    return null;
                }

                const numericValue = Number(trimmedValue);
                return Number.isNaN(numericValue) ? trimmedValue : numericValue;
            })
            .filter((value): value is number | string => value !== null);
    }

    private buildIssuePrompt(issue: IRedmineIssue) {
        const issueSnapshot = {
            redmineId: issue.redmineId,
            subject: issue.subject,
            description: issue.description,
            project: issue.project,
            tracker: issue.tracker,
            status: issue.status,
            priority: issue.priority,
            author: issue.author,
            fixedVersion: issue.fixedVersion,
            doneRatio: issue.doneRatio,
            spentHours: issue.spentHours,
            totalSpentHours: issue.totalSpentHours,
            estimatedHours: issue.estimatedHours,
            totalEstimatedHours: issue.totalEstimatedHours,
            startDate: issue.startDate,
            dueDate: issue.dueDate,
            createdOn: issue.createdOn,
            updatedOn: issue.updatedOn,
            closedOn: issue.closedOn,
            customFields: issue.customFields,
            journals: Array.isArray(issue.journals)
                ? issue.journals.map((journal) => ({
                    id: journal.id,
                    user: journal.user,
                    createdOn: journal.createdOn,
                    notes: journal.notes,
                    details: Array.isArray(journal.details)
                        ? journal.details.map((detail) => ({
                            property: detail.property,
                            name: detail.name,
                            oldValue: detail.oldValue,
                            newValue: detail.newValue,
                        }))
                        : [],
                }))
                : [],
        };

        return JSON.stringify(issueSnapshot, null, 2);
    }

    private buildIssueSnapshot(issue: IRedmineIssue): IRedmineIssueBase {
        return {
            redmineId: issue.redmineId,
            subject: issue.subject,
            description: issue.description,
            doneRatio: issue.doneRatio,
            isPrivate: issue.isPrivate,
            spentHours: issue.spentHours,
            totalSpentHours: issue.totalSpentHours,
            estimatedHours: issue.estimatedHours,
            totalEstimatedHours: issue.totalEstimatedHours,
            startDate: issue.startDate,
            dueDate: issue.dueDate,
            createdOn: issue.createdOn,
            updatedOn: issue.updatedOn,
            closedOn: issue.closedOn,
            project: issue.project,
            tracker: issue.tracker,
            status: issue.status,
            priority: issue.priority,
            author: issue.author,
            fixedVersion: issue.fixedVersion,
            journals: issue.journals,
            customFields: issue.customFields,
            syncSource: issue.syncSource,
            rawPayload: issue.rawPayload,
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
        };
    }

    private async loadIssues(filters: IDraxFieldFilter[]) {
        const limit = 100;
        const items: IRedmineIssue[] = [];
        let page = 1;
        let total = 0;

        do {
            const response = await this.issueService.paginate({
                page,
                limit,
                orderBy: "createdOn",
                order: "asc",
                search: "",
                filters,
            }) as {
                items?: IRedmineIssue[];
                total?: number;
            };

            const pageItems = Array.isArray(response?.items) ? response.items : [];
            total = typeof response?.total === "number" ? response.total : pageItems.length;

            items.push(...pageItems);
            page += 1;

            if (pageItems.length === 0) {
                break;
            }
        } while (items.length < total);

        return items;
    }

    private async upsertAnalysis(issue: IRedmineIssue, analysis: Omit<IRedmineIssueAnalysisBase, "redmineIssue">) {
        const payload: IRedmineIssueAnalysisBase = {
            ...analysis,
            redmineIssue: issue._id,
            issue: this.buildIssueSnapshot(issue),
        };

        const existing = await this.service.findOne({
            filters: [
                {
                    field: "redmineIssue",
                    operator: "eq",
                    value: issue._id,
                },
            ],
            search: "",
        }).catch(() => null);

        if (existing?._id) {
            await this.service.update(existing._id, payload);
            return "updated";
        }

        await this.service.create(payload);
        return "created";
    }

    private normalizeAnalysisForPersistence(analysis: z.infer<typeof RedmineIssueAnalysisPromptSchema>): Omit<IRedmineIssueAnalysisBase, "redmineIssue"> {
        const normalizedEntries = Object.entries(analysis).filter(([key, value]) => {
            if (value !== null) {
                return true;
            }

            return key === "confianza";
        });

        return Object.fromEntries(normalizedEntries) as Omit<IRedmineIssueAnalysisBase, "redmineIssue">;
    }

    private parseAiOutput(output: unknown) {
        if (typeof output === "string") {
            const trimmedOutput = output.trim();

            if (trimmedOutput.length === 0) {
                throw new Error("AI provider returned an empty string output");
            }

            try {
                return JSON.parse(trimmedOutput);
            } catch (error: any) {
                throw new Error(`AI provider returned a string that is not valid JSON: ${error?.message ?? "unknown parse error"}`);
            }
        }

        return output;
    }

    private formatErrorForLog(error: unknown) {
        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: (error as Error & {cause?: unknown}).cause,
            };
        }

        return error;
    }

    private logAnalysisError(params: {
        issue: IRedmineIssue;
        error: unknown;
        promptResponse?: unknown;
    }) {
        const {issue, error, promptResponse} = params;

        console.error("[RedmineIssueAnalysisController] analyzeIssues failed", {
            redmineIssueId: issue._id,
            redmineId: issue.redmineId,
            subject: issue.subject,
            error: this.formatErrorForLog(error),
            promptResponse,
        });
    }

    async analyzeIssues(request: CustomRequest, reply: FastifyReply) {
        try {
            request?.rbac.assertAuthenticated();

            const body = (request.body ?? {}) as IAnalyzeIssuesPayload;
            const {from, to, fromStart, toEnd} = this.ensureDateRange(body.dateFrom, body.dateTo);

            if (body.projectId == null || String(body.projectId).trim() === "") {
                throw new Error("projectId is required");
            }

            const projectId = this.normalizeFilterValues([body.projectId])[0] ?? body.projectId;
            const statusIds = this.normalizeFilterValues(body.statusIds);

            const filters: IDraxFieldFilter[] = [
                {field: "project.id", operator: "eq", value: projectId},
                {field: "createdOn", operator: "gte", value: fromStart},
                {field: "createdOn", operator: "lte", value: toEnd},
            ];

            if (statusIds.length > 0) {
                filters.push({
                    field: "status.id",
                    operator: "in",
                    value: statusIds,
                });
            }

            const issues = await this.loadIssues(filters);

            const result: IAnalyzeIssuesResult = {
                projectId: body.projectId,
                dateFrom: from.toISOString(),
                dateTo: to.toISOString(),
                statusIds: body.statusIds ?? [],
                total: issues.length,
                created: 0,
                updated: 0,
                failed: 0,
                errors: [],
            };

            for (const issue of issues) {
                let promptResponse: any = null;

                try {
                    promptResponse = await this.aiProvider.prompt({
                        systemPrompt: [
                            "Sos un analista funcional y tecnico especializado en tickets de Redmine.",
                            "Analiza un issue y devolve exclusivamente un JSON valido que respete el schema indicado.",
                            "Usa solo la informacion disponible en el ticket.",
                            "Todos los campos del JSON deben estar presentes.",
                            "Si un dato no se puede inferir con razon suficiente, devolvelo como null.",
                            "El campo confianza debe estar entre 0 y 1.",
                            "nivelDetectabilidadDesarrollo mide que tan evidente o evitable era el error para desarrollo: muy_baja si era muy dificil de detectar sin un caso rebuscado; baja si requeria atencion especial; alta si habia seniales claras; muy_alta si era un error obvio que desarrollo debio detectar.",
                            "tipoTrabajoTecnico debe inferir si la resolucion principal parece de frontend, backend o fullstack.",
                            "Responde en espanol neutro y sin texto extra.",
                        ].join("\n"),
                        userInput: [
                            "Genera un analisis estructurado del siguiente Redmine issue.",
                            "No incluyas el campo redmineIssue porque se completa del lado del servidor.",
                            "Ticket:",
                            this.buildIssuePrompt(issue),
                        ].join("\n\n"),
                        zodSchema: RedmineIssueAnalysisPromptSchema,
                        operationTitle: "redmine-issue-analysis",
                        operationGroup: "redmine",
                        ip: request.ip,
                        userAgent: request.headers["user-agent"],
                        tenant: request.rbac?.tenantId ?? null,
                        user: request.rbac?.userId ?? null,
                    });

                    const parsedOutput = this.parseAiOutput(promptResponse.output);
                    const analysis = this.normalizeAnalysisForPersistence(
                        RedmineIssueAnalysisPromptSchema.parse(parsedOutput),
                    );
                    const action = await this.upsertAnalysis(issue, analysis);
                    result[action] += 1;
                } catch (error: any) {
                    this.logAnalysisError({
                        issue,
                        error,
                        promptResponse,
                    });

                    result.failed += 1;
                    result.errors.push({
                        redmineIssueId: issue._id,
                        subject: issue.subject ?? `#${issue.redmineId}`,
                        message: error?.message ?? "Unknown analysis error",
                    });
                }
            }

            return result;
        } catch (e) {
            this.handleError(e, reply);
        }
    }

}

export default RedmineIssueAnalysisController;
export {
    RedmineIssueAnalysisController
}
