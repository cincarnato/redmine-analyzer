import type {CustomRequest} from "@drax/crud-back";
import type {IDraxFieldFilter} from "@drax/crud-share";
import {AiProviderFactory} from "@drax/ai-back";
import {z} from "zod";
import RedmineIssueAnalysisServiceFactory from "../factory/services/RedmineIssueAnalysisServiceFactory.js";
import RedmineIssueServiceFactory from "../factory/services/RedmineIssueServiceFactory.js";
import type {IRedmineIssue, IRedmineIssueBase} from "../interfaces/IRedmineIssue";
import type {IRedmineIssueAnalysisBase} from "../interfaces/IRedmineIssueAnalysis";

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
        "nueva_funcionalidad",
        "error",
        "soporte",
        "mantenimiento",
        "refactorizacion",
        "investigacion",
        "configuracion",
        "documentacion",
        "tarea_tecnica",
        "integracion",
        "optimizacion",
        "seguridad",
        "datos",
        "infraestructura",
        "otro"
    ]).nullable(),
    causaError: z.enum([
        "falla_de_aceptacion",
        "regresion",
        "definicion_incompleta",
        "detalle_menor",
        "oportunidad_de_mejora",
        "problema_de_integracion",
        "problema_de_datos",
        "problema_de_entorno",
        "error_de_usuario",
        "caso_borde"
    ]).nullable(),
    severidadError: z.enum([
        "bloqueante",
        "critico",
        "alto",
        "medio",
        "bajo"
    ]).nullable(),
    tipoError: z.enum([
        "funcional",
        "regla_de_negocio",
        "validacion",
        "seguridad",
        "performance",
        "interfaz",
        "integracion",
        "integridad_de_datos",
        "compatibilidad",
        "configuracion",
        "infraestructura"
    ]).nullable(),
    objetivo: z.enum([
        "nueva_capacidad",
        "correccion_de_falla",
        "estabilidad",
        "reduccion_de_deuda_tecnica",
        "soporte_operativo",
        "cumplimiento",
        "mejora_experiencia_usuario",
        "reduccion_de_costos",
        "investigacion",
        "automatizacion",
        "escalabilidad",
        "observabilidad",
        "otro"
    ]).nullable(),
    valorNegocio: z.enum(["muy_bajo", "bajo", "medio", "alto", "muy_alto"]).nullable(),
    complejidad: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    nivelUrgencia: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    nivelDetectabilidadDesarrollo: z.enum(["muy_baja", "baja", "alta", "muy_alta"]).nullable(),
    tipoTrabajoTecnico: z.enum(["frontend", "backend", "fullstack"]).nullable(),
    rolObjetivo: z.string().nullable(),
    areaFuncional: z.string().nullable(),
    seniales: z.array(z.enum([
        "requerimiento_poco_claro",
        "cambio_muy_pequenio",
        "exceso_de_coordinacion",
        "retrabajo",
        "operacion_manual",
        "bajo_impacto_de_negocio",
        "duplicacion_de_esfuerzo",
        "dependencia_evita_avance",
        "analisis_excesivo",
        "espera_prolongada",
        "buena_definicion",
        "mala_definicion",
        "cambio_de_alcance",
        "demora_por_dependencia",
        "gap_de_testing",
        "resolucion_rapida",
        "estimacion_desviada",
        "prioridad_inestable",
        "falta_de_contexto",
        "buena_colaboracion",
        "alto_ida_y_vuelta"
    ])).nullable(),
});

class RedmineIssueAnalyzer {
    private readonly issueService = RedmineIssueServiceFactory.instance;

    private readonly issueAnalysisService = RedmineIssueAnalysisServiceFactory.instance;

    private readonly aiProvider = AiProviderFactory.instance();

    private static readonly ERROR_QA_TRACKER_NAME = "Error QA";

    private static readonly ERROR_QA_CONTEXT_TRACKER_NAMES = new Set(["Tarea Desarrollo", "User Story"]);

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

    private buildPromptIssueSnapshot(issue: IRedmineIssue) {
        return {
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
            relations: Array.isArray(issue.relations)
                ? issue.relations.map((relation) => ({
                    id: relation.id,
                    issueId: relation.issueId,
                    issueToId: relation.issueToId,
                    relationType: relation.relationType,
                    delay: relation.delay,
                }))
                : [],
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
    }

    private buildRelatedContextIssueSnapshot(issue: IRedmineIssue) {
        return {
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
            relations: Array.isArray(issue.relations)
                ? issue.relations.map((relation) => ({
                    id: relation.id,
                    issueId: relation.issueId,
                    issueToId: relation.issueToId,
                    relationType: relation.relationType,
                    delay: relation.delay,
                }))
                : [],
        };
    }

    private buildIssuePrompt(issue: IRedmineIssue, relatedContextIssues: IRedmineIssue[] = []) {
        const issueSnapshot = {
            ...this.buildPromptIssueSnapshot(issue),
            relatedContextIssues: relatedContextIssues.map((relatedIssue) => this.buildRelatedContextIssueSnapshot(relatedIssue)),
        };

        return JSON.stringify(issueSnapshot, null, 2);
    }

    private isErrorQaIssue(issue: IRedmineIssue) {
        return issue.tracker?.name === RedmineIssueAnalyzer.ERROR_QA_TRACKER_NAME;
    }

    private getRelatedIssueRedmineIds(issue: IRedmineIssue) {
        if (!Array.isArray(issue.relations)) {
            return [];
        }

        return Array.from(new Set(
            issue.relations
                .map((relation) => {
                    if (relation.issueId === issue.redmineId) {
                        return relation.issueToId;
                    }

                    if (relation.issueToId === issue.redmineId) {
                        return relation.issueId;
                    }

                    return null;
                })
                .filter((relatedId): relatedId is number => typeof relatedId === "number"),
        ));
    }

    private async findIssueByRedmineId(redmineId: number) {
        return this.issueService.findOne({
            filters: [
                {
                    field: "redmineId",
                    operator: "eq",
                    value: redmineId,
                },
            ],
            search: "",
        }).catch(() => null) as Promise<IRedmineIssue | null>;
    }

    private async loadErrorQaContextIssues(issue: IRedmineIssue) {
        if (!this.isErrorQaIssue(issue)) {
            return [];
        }

        const relatedIssueIds = this.getRelatedIssueRedmineIds(issue);
        if (relatedIssueIds.length === 0) {
            return [];
        }

        const relatedIssues = await Promise.all(
            relatedIssueIds.map((relatedIssueId) => this.findIssueByRedmineId(relatedIssueId)),
        );

        return relatedIssues.filter((relatedIssue): relatedIssue is IRedmineIssue => (
            relatedIssue !== null
            && RedmineIssueAnalyzer.ERROR_QA_CONTEXT_TRACKER_NAMES.has(relatedIssue.tracker?.name ?? "")
        ));
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
            relations: issue.relations,
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

        const existing = await this.issueAnalysisService.findOne({
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
            await this.issueAnalysisService.update(existing._id, payload);
            return "updated" as const;
        }

        await this.issueAnalysisService.create(payload);
        return "created" as const;
    }

    private normalizeAnalysisForPersistence(analysis: z.infer<typeof RedmineIssueAnalysisPromptSchema>): Omit<IRedmineIssueAnalysisBase, "redmineIssue"> {
        const normalizedEntries = Object.entries(analysis).filter(([, value]) => value !== null);

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

        console.error("[RedmineIssueAnalyzer] analyzeIssues failed", {
            redmineIssueId: issue._id,
            redmineId: issue.redmineId,
            subject: issue.subject,
            error: this.formatErrorForLog(error),
            promptResponse,
        });
    }

    async analyzeIssues(request: CustomRequest, body: IAnalyzeIssuesPayload) {
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
                const relatedContextIssues = await this.loadErrorQaContextIssues(issue);

                promptResponse = await this.aiProvider.prompt({
                    systemPrompt: [
                        "Sos un analista funcional y tecnico especializado en tickets de Redmine.",
                        "Analiza un issue y devolve exclusivamente un JSON valido que respete el schema indicado.",
                        "Usa solo la informacion disponible en el ticket.",
                        "Todos los campos del JSON deben estar presentes.",
                        "Si un dato no se puede inferir con razon suficiente, devolvelo como null.",
                        "Los campos causaError, severidadError y tipoError aplican solo cuando el ticket corresponde a un error o desvio real; si no aplica, devolvelos como null.",
                        "causaError debe elegirse solo entre: falla_de_aceptacion, regresion, definicion_incompleta, detalle_menor, oportunidad_de_mejora, problema_de_integracion, problema_de_datos, problema_de_entorno, error_de_usuario, caso_borde.",
                        "Criterios de causaError: falla_de_aceptacion si no cumple criterios definidos; regresion si algo que antes andaba se rompio por cambios recientes; definicion_incompleta si falta criterio esperado; detalle_menor si el impacto es bajo y no impide uso; oportunidad_de_mejora si no es bug pero surge una mejora clara; problema_de_integracion si falla por sistemas externos o APIs; problema_de_datos si hay datos incorrectos o corruptos; problema_de_entorno si depende de configuracion o diferencias entre entornos; error_de_usuario si el comportamiento se explica por mal uso y no por bug; caso_borde si ocurre en un escenario raro no contemplado.",
                        "severidadError debe elegirse solo entre: bloqueante, critico, alto, medio, bajo.",
                        "Criterios de severidadError: bloqueante si la funcionalidad queda inutilizable y sin workaround; critico si hay impacto severo en operaciones clave; alto si el problema es importante pero hay workaround o no bloquea por completo; medio si el impacto es moderado; bajo si el impacto es minimo o visual.",
                        "tipoError debe elegirse solo entre: funcional, regla_de_negocio, validacion, seguridad, performance, interfaz, integracion, integridad_de_datos, compatibilidad, configuracion, infraestructura.",
                        "Criterios de tipoError: funcional si no cumple la funcionalidad esperada; regla_de_negocio si no respeta reglas del negocio; validacion si fallan reglas de entrada; seguridad si hay riesgo de acceso o exposicion; performance si hay lentitud o ineficiencia; interfaz si afecta UX o presentacion; integracion si falla comunicacion externa; integridad_de_datos si los datos quedan incorrectos o corruptos; compatibilidad si falla en ciertos dispositivos, navegadores o entornos; configuracion si hay parametros mal configurados; infraestructura si el origen es tecnico o de plataforma.",
                        "nivelDetectabilidadDesarrollo mide que tan evidente o evitable era el error para desarrollo: muy_baja si era muy dificil de detectar sin un caso rebuscado; baja si requeria atencion especial; alta si habia seniales claras; muy_alta si era un error obvio que desarrollo debio detectar.",
                        "tipoTrabajoTecnico debe inferir si la resolucion principal parece de frontend, backend o fullstack.",
                        "Responde en espanol neutro y sin texto extra.",
                    ].join("\n"),
                    userInput: [
                        "Genera un analisis estructurado del siguiente Redmine issue.",
                        "No incluyas el campo redmineIssue porque se completa del lado del servidor.",
                        "Si el campo relatedContextIssues contiene tickets relacionados, usalos solo como contexto para entender el origen del issue principal.",
                        "Ticket:",
                        this.buildIssuePrompt(issue, relatedContextIssues),
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
    }
}

export default RedmineIssueAnalyzer;
export type {
    IAnalyzeIssueError,
    IAnalyzeIssuesPayload,
    IAnalyzeIssuesResult,
};
export {
    RedmineIssueAnalyzer,
};
