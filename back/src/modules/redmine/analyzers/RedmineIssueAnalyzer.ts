import type {CustomRequest} from "@drax/crud-back";
import type {IDraxFieldFilter} from "@drax/crud-share";
import {AiProviderFactory} from "@drax/ai-back";
import {z} from "zod";
import RedmineIssueAnalysisServiceFactory from "../factory/services/RedmineIssueAnalysisServiceFactory.js";
import RedmineIssueServiceFactory from "../factory/services/RedmineIssueServiceFactory.js";
import RedmineProjectServiceFactory from "../factory/services/RedmineProjectServiceFactory.js";
import type {IRedmineIssue, IRedmineIssueBase} from "../interfaces/IRedmineIssue";
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from "../interfaces/IRedmineIssueAnalysis";
import type {IRedmineProject} from "../interfaces/IRedmineProject";

interface IAnalyzeIssuesPayload {
    projectId?: number | string;
    dateFrom?: string;
    dateTo?: string;
    statusIds?: Array<number | string>;
}

interface IAnalyzeIssuePayload {
    redmineId?: number | string;
    descriptionOverride?: string;
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

interface IAnalyzeIssueResult {
    redmineId: number;
    analysis: IRedmineIssueAnalysis;
}

interface IAssistIssuePayload {
    redmineId?: number | string;
    currentDescription?: string;
    userInput?: string;
    analysis?: Partial<IRedmineIssueAnalysis>;
}

interface IAssistIssueResult {
    descripcionPropuesta: string;
    preguntasComentarios: string[];
    tokens: number;
    inputTokens: number;
    outputTokens: number;
    time: number;
}

const RedmineIssueBaseAnalysisPromptSchema = z.object({
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
    modulo: z.string().nullable(),
    objetivo: z.string().nullable(),
    objetivoPropuesto: z.string().nullable(),
    moduloPropuesto: z.string().nullable(),
    valorNegocio: z.enum(["muy_bajo", "bajo", "medio", "alto", "muy_alto"]).nullable(),
    complejidad: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    nivelUrgencia: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
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

const RedmineIssueErrorAnalysisPromptSchema = z.object({
    causaError: z.enum([
        "criterio_fallido",
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
    observationError: z.string().nullable(),
    criterioError: z.string().nullable(),
    nivelDetectabilidadDesarrollo: z.enum(["muy_baja", "baja", "alta", "muy_alta"]).nullable(),
});

const RedmineIssueStoryQualityPromptSchema = z.object({
    calidadCriteriosAceptacion: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    atomicidad: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    ambiguedadDefinicion: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    claridadAlcance: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    testabilidad: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    consistencia: z.enum(["muy_baja", "baja", "media", "alta", "muy_alta"]).nullable(),
    riesgoErrorQA: z.enum(["muy_bajo", "bajo", "medio", "alto", "muy_alto"]).nullable(),
    requiereRefinamiento: z.boolean().nullable(),
    cantidadObjetivosDetectados: z.number().int().min(0).nullable(),
    hallazgosDefinicion: z.array(z.enum([
        "sin_criterios_de_aceptacion",
        "criterios_demasiado_generales",
        "criterios_no_verificables",
        "criterios_incompletos",
        "criterios_bien_definidos",
        "historia_demasiado_grande",
        "historia_bien_atomica",
        "multiples_objetivos_en_un_mismo_ticket",
        "descripcion_ambigua",
        "descripcion_incompleta",
        "alcance_poco_claro",
        "alcance_bien_delimitado",
        "falta_contexto_funcional",
        "dependencia_no_explicitada",
        "cambio_de_alcance_no_actualizado",
        "comentarios_contradicen_descripcion",
        "requiere_definicion_adicional",
        "facil_de_validar"
    ])).nullable(),
    observacionesDefinicion: z.string().nullable(),
});

const RedmineIssueAssistPromptSchema = z.object({
    descripcionPropuesta: z.string(),
    preguntasComentarios: z.array(z.string()),
});

type IBaseAnalysis = z.infer<typeof RedmineIssueBaseAnalysisPromptSchema>;
type IErrorAnalysis = z.infer<typeof RedmineIssueErrorAnalysisPromptSchema>;
type IStoryQualityAnalysis = z.infer<typeof RedmineIssueStoryQualityPromptSchema>;
type IProjectTaxonomy = {
    goals: string[];
    modules: string[];
};

const ERROR_ANALYSIS_FIELDS = [
    "causaError",
    "severidadError",
    "tipoError",
    "observationError",
    "criterioError",
    "nivelDetectabilidadDesarrollo",
] as const;

const STORY_QUALITY_FIELDS = [
    "calidadCriteriosAceptacion",
    "atomicidad",
    "ambiguedadDefinicion",
    "claridadAlcance",
    "testabilidad",
    "consistencia",
    "riesgoErrorQA",
    "requiereRefinamiento",
    "cantidadObjetivosDetectados",
    "hallazgosDefinicion",
    "observacionesDefinicion",
] as const;

class RedmineIssueAnalyzer {
    private readonly issueService = RedmineIssueServiceFactory.instance;

    private readonly issueAnalysisService = RedmineIssueAnalysisServiceFactory.instance;

    private readonly projectService = RedmineProjectServiceFactory.instance;

    private readonly aiProvider = AiProviderFactory.instance();

    private static readonly ERROR_QA_TRACKER_NAME = "Error QA";

    private static readonly ERROR_QA_CONTEXT_TRACKER_NAMES = new Set([
        "Requerimiento",
        "Requirement",
        "Tarea",
        "Tarea Desarrollo",
        "Tarea de Desarrollo",
        "User Story",
    ]);

    private static readonly USER_STORY_TRACKER_NAMES = new Set(["User Story"]);

    private static readonly ANALYZE_ISSUE_MAX_ATTEMPTS = 2;

    private static readonly ANALYZE_ISSUE_RETRY_DELAY_MS = 1000;

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

    private normalizeRequiredRedmineId(redmineId?: number | string) {
        if (redmineId == null || String(redmineId).trim() === "") {
            throw new Error("redmineId is required");
        }

        const normalizedRedmineId = Number(redmineId);
        if (!Number.isInteger(normalizedRedmineId) || normalizedRedmineId <= 0) {
            throw new Error("redmineId must be a positive integer");
        }

        return normalizedRedmineId;
    }

    private applyDescriptionOverride(issue: IRedmineIssue, descriptionOverride?: string) {
        if (typeof descriptionOverride !== "string") {
            return issue;
        }

        return {
            ...issue,
            description: descriptionOverride,
        };
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

    private normalizeNamedProjectItems(items?: Array<{name: string; description?: string}>) {
        if (!Array.isArray(items)) {
            return [];
        }

        return Array.from(new Set(
            items
                .map((item) => item?.name?.trim())
                .filter((item): item is string => Boolean(item)),
        ));
    }

    private async loadProjectTaxonomy(projectRedmineId?: number | null): Promise<IProjectTaxonomy> {
        if (typeof projectRedmineId !== "number" || Number.isNaN(projectRedmineId)) {
            return {goals: [], modules: []};
        }

        const project = await this.projectService.findOne({
            filters: [
                {
                    field: "redmineId",
                    operator: "eq",
                    value: projectRedmineId,
                },
            ],
            search: "",
        }).catch(() => null) as IRedmineProject | null;

        return {
            goals: this.normalizeNamedProjectItems(project?.goals),
            modules: this.normalizeNamedProjectItems(project?.modules),
        };
    }

    private buildTaxonomyPromptLines(taxonomy: IProjectTaxonomy) {
        const lines = [
            "modulo, objetivo, moduloPropuesto y objetivoPropuesto deben estar siempre presentes en el JSON.",
        ];

        if (taxonomy.modules.length > 0) {
            lines.push(
                `Para modulo usa solo uno de estos nombres exactos si hay match claro: ${taxonomy.modules.join(", ")}.`,
                "Si ningun modulo definido aplica con razon suficiente, devolve modulo = null y completa moduloPropuesto con una etiqueta corta y libre.",
            );
        } else {
            lines.push(
                "No hay lista predefinida de modulos para el proyecto, asi que modulo puede ser una etiqueta libre y concreta.",
                "Si modulo ya refleja bien el analisis, devolve moduloPropuesto = null.",
            );
        }

        if (taxonomy.goals.length > 0) {
            lines.push(
                `Para objetivo usa solo uno de estos nombres exactos si hay match claro: ${taxonomy.goals.join(", ")}.`,
                "Si ningun objetivo definido aplica con razon suficiente, devolve objetivo = null y completa objetivoPropuesto con una etiqueta corta y libre.",
            );
        } else {
            lines.push(
                "No hay lista predefinida de objetivos para el proyecto, asi que objetivo puede ser una etiqueta libre y concreta.",
                "Si objetivo ya refleja bien el analisis, devolve objetivoPropuesto = null.",
            );
        }

        lines.push(
            "No inventes coincidencias forzadas con listas predefinidas.",
            "Si modulo u objetivo quedan en null, intenta completar su campo Propuesto correspondiente con el mejor texto libre posible.",
        );

        return lines;
    }

    private normalizeFreeText(value: string | null | undefined) {
        if (typeof value !== "string") {
            return null;
        }

        const trimmedValue = value.trim();
        return trimmedValue.length > 0 ? trimmedValue : null;
    }

    private normalizeBaseAnalysisWithTaxonomy(analysis: IBaseAnalysis, taxonomy: IProjectTaxonomy): IBaseAnalysis {
        const normalizedAnalysis: IBaseAnalysis = {
            ...analysis,
            modulo: this.normalizeFreeText(analysis.modulo),
            objetivo: this.normalizeFreeText(analysis.objetivo),
            moduloPropuesto: this.normalizeFreeText(analysis.moduloPropuesto),
            objetivoPropuesto: this.normalizeFreeText(analysis.objetivoPropuesto),
        };

        if (taxonomy.modules.length > 0 && normalizedAnalysis.modulo && !taxonomy.modules.includes(normalizedAnalysis.modulo)) {
            normalizedAnalysis.moduloPropuesto = normalizedAnalysis.moduloPropuesto ?? normalizedAnalysis.modulo;
            normalizedAnalysis.modulo = null;
        }

        if (taxonomy.goals.length > 0 && normalizedAnalysis.objetivo && !taxonomy.goals.includes(normalizedAnalysis.objetivo)) {
            normalizedAnalysis.objetivoPropuesto = normalizedAnalysis.objetivoPropuesto ?? normalizedAnalysis.objetivo;
            normalizedAnalysis.objetivo = null;
        }

        if (taxonomy.modules.length === 0 && normalizedAnalysis.modulo) {
            normalizedAnalysis.moduloPropuesto = null;
        }

        if (taxonomy.goals.length === 0 && normalizedAnalysis.objetivo) {
            normalizedAnalysis.objetivoPropuesto = null;
        }

        return normalizedAnalysis;
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

    private async upsertAnalysis(
        issue: IRedmineIssue,
        analysis: Omit<IRedmineIssueAnalysisBase, "redmineIssue">,
        existing?: IRedmineIssueAnalysis | null,
    ) {
        const payload: IRedmineIssueAnalysisBase = {
            ...analysis,
            redmineIssue: issue._id,
            issue: this.buildIssueSnapshot(issue),
        };

        const currentAnalysis = existing ?? await this.issueAnalysisService.findOne({
            filters: [
                {
                    field: "redmineIssue",
                    operator: "eq",
                    value: issue._id,
                },
            ],
            search: "",
        }).catch(() => null);

        if (currentAnalysis?._id) {
            await this.issueAnalysisService.update(currentAnalysis._id, payload);
            return "updated" as const;
        }

        await this.issueAnalysisService.create(payload);
        return "created" as const;
    }

    private normalizeAnalysisForPersistence<T extends Record<string, unknown>>(analysis: T) {
        return analysis as Partial<T>;
    }

    private clearFields<T extends readonly string[]>(fields: T) {
        return Object.fromEntries(fields.map((field) => [field, null])) as Record<T[number], null>;
    }

    private shouldAnalyzeError(issue: IRedmineIssue, baseAnalysis: IBaseAnalysis) {
        return this.isErrorQaIssue(issue) || baseAnalysis.categoria === "error";
    }

    private shouldAnalyzeStoryQuality(issue: IRedmineIssue, baseAnalysis: IBaseAnalysis) {
        const trackerName = issue.tracker?.name ?? "";
        return RedmineIssueAnalyzer.USER_STORY_TRACKER_NAMES.has(trackerName)
            || baseAnalysis.categoria === "nueva_funcionalidad"
            || baseAnalysis.objetivo === "nueva_capacidad";
    }

    private async executeAnalysisStage<T extends z.ZodTypeAny>(params: {
        request: CustomRequest;
        issue: IRedmineIssue;
        relatedContextIssues?: IRedmineIssue[];
        systemPromptLines: string[];
        userPromptLines: string[];
        schema: T;
        operationTitle: string;
    }) {
        const promptResponse = await this.aiProvider.prompt({
            systemPrompt: params.systemPromptLines.join("\n"),
            userInput: [
                ...params.userPromptLines,
                "No incluyas el campo redmineIssue porque se completa del lado del servidor.",
                "Si el campo relatedContextIssues contiene tickets relacionados, usalos solo como contexto para entender el origen del issue principal.",
                "Ticket:",
                this.buildIssuePrompt(params.issue, params.relatedContextIssues ?? []),
            ].join("\n\n"),
            zodSchema: params.schema,
            operationTitle: params.operationTitle,
            operationGroup: "redmine",
            ip: params.request.ip,
            userAgent: params.request.headers["user-agent"],
            tenant: params.request.rbac?.tenantId ?? null,
            user: params.request.rbac?.userId ?? null,
        });

        const parsedOutput = this.parseAiOutput(promptResponse.output);
        return {
            promptResponse,
            analysis: params.schema.parse(parsedOutput) as z.infer<T>,
        };
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

    private async wait(ms: number) {
        await new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    private logAnalysisError(params: {
        issue: IRedmineIssue;
        error: unknown;
        promptResponse?: unknown;
        attempt?: number;
        maxAttempts?: number;
    }) {
        const {issue, error, promptResponse, attempt, maxAttempts} = params;

        console.error("[RedmineIssueAnalyzer] analyzeIssues failed", {
            redmineIssueId: issue._id,
            redmineId: issue.redmineId,
            subject: issue.subject,
            attempt,
            maxAttempts,
            error: this.formatErrorForLog(error),
            promptResponse,
        });
    }

    private logAnalysisRetry(params: {
        issue: IRedmineIssue;
        error: unknown;
        attempt: number;
        maxAttempts: number;
    }) {
        const {issue, error, attempt, maxAttempts} = params;

        console.warn("[RedmineIssueAnalyzer] analyzeIssues retrying failed issue", {
            redmineIssueId: issue._id,
            redmineId: issue.redmineId,
            subject: issue.subject,
            attempt,
            maxAttempts,
            error: this.formatErrorForLog(error),
        });
    }

    private async analyzeAndPersistIssue(request: CustomRequest, issue: IRedmineIssue) {
        const existingAnalysis = await this.issueAnalysisService.findOne({
            filters: [
                {
                    field: "redmineIssue",
                    operator: "eq",
                    value: issue._id,
                },
            ],
            search: "",
        }).catch(() => null) as IRedmineIssueAnalysis | null;

        const analysis = await this.analyzeSingleIssue(request, issue);
        return this.upsertAnalysis(issue, analysis, existingAnalysis);
    }

    private async analyzeAndPersistIssueWithRetry(request: CustomRequest, issue: IRedmineIssue) {
        const maxAttempts = RedmineIssueAnalyzer.ANALYZE_ISSUE_MAX_ATTEMPTS;
        let lastError: unknown;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            try {
                return await this.analyzeAndPersistIssue(request, issue);
            } catch (error: unknown) {
                lastError = error;

                if (attempt >= maxAttempts) {
                    this.logAnalysisError({
                        issue,
                        error,
                        attempt,
                        maxAttempts,
                    });
                    break;
                }

                this.logAnalysisRetry({
                    issue,
                    error,
                    attempt,
                    maxAttempts,
                });
                await this.wait(RedmineIssueAnalyzer.ANALYZE_ISSUE_RETRY_DELAY_MS);
            }
        }

        throw lastError;
    }

    private async analyzeSingleIssue(request: CustomRequest, issue: IRedmineIssue) {
        const relatedContextIssues = await this.loadErrorQaContextIssues(issue);
        const projectTaxonomy = await this.loadProjectTaxonomy(issue.project?.id ?? null);
        const taxonomyPromptLines = this.buildTaxonomyPromptLines(projectTaxonomy);

        const baseStage = await this.executeAnalysisStage({
            request,
            issue,
            relatedContextIssues,
            schema: RedmineIssueBaseAnalysisPromptSchema,
            operationTitle: "redmine-issue-analysis-base",
            systemPromptLines: [
                "Sos un analista funcional y tecnico especializado en tickets de Redmine.",
                "Analiza un issue y devolve exclusivamente un JSON valido que respete el schema indicado.",
                "Esta es la ETAPA 1: clasificacion base del ticket.",
                "Usa solo la informacion disponible en el ticket.",
                "Todos los campos del JSON deben estar presentes.",
                "Si un dato no se puede inferir con razon suficiente, devolvelo como null.",
                "Clasifica el ticket segun resumen, categoria, objetivo, valorNegocio, complejidad, nivelUrgencia, tipoTrabajoTecnico, rolObjetivo, areaFuncional y seniales generales.",
                ...taxonomyPromptLines,
                "tipoTrabajoTecnico debe inferir si la resolucion principal parece de frontend, backend o fullstack.",
                "Responde en espanol neutro y sin texto extra.",
            ],
            userPromptLines: [
                "Genera la clasificacion base del siguiente Redmine issue.",
            ],
        });

        const normalizedBaseStageAnalysis = this.normalizeBaseAnalysisWithTaxonomy(baseStage.analysis, projectTaxonomy);
        const baseAnalysis = this.normalizeAnalysisForPersistence(normalizedBaseStageAnalysis);
        const shouldAnalyzeError = this.shouldAnalyzeError(issue, normalizedBaseStageAnalysis);
        const shouldAnalyzeStoryQuality = this.shouldAnalyzeStoryQuality(issue, normalizedBaseStageAnalysis);

        let errorAnalysis: Partial<IErrorAnalysis> = this.clearFields(ERROR_ANALYSIS_FIELDS);
        if (shouldAnalyzeError) {
            const errorStage = await this.executeAnalysisStage({
                request,
                issue,
                relatedContextIssues,
                schema: RedmineIssueErrorAnalysisPromptSchema,
                operationTitle: "redmine-issue-analysis-error",
                systemPromptLines: [
                    "Sos un analista funcional y tecnico especializado en tickets de Redmine.",
                    "Analiza un issue y devolve exclusivamente un JSON valido que respete el schema indicado.",
                    "Esta es la ETAPA 2: analisis especifico de error.",
                    "Usa solo la informacion disponible en el ticket.",
                    "Todos los campos del JSON deben estar presentes.",
                    "Si un dato no se puede inferir con razon suficiente, devolvelo como null.",
                    "Aplica esta etapa solo porque el ticket parece error, bug o incidente.",
                    "causaError debe elegirse solo entre: criterio_fallido, regresion, definicion_incompleta, detalle_menor, oportunidad_de_mejora, problema_de_integracion, problema_de_datos, problema_de_entorno, error_de_usuario, caso_borde.",
                    "Usa criterio_fallido solo cuando haya evidencia concreta de un criterio de aceptacion o comportamiento definido que fue incumplido.",
                    "Esa evidencia puede estar en el ticket de Error QA o en relatedContextIssues, pero debe referir a un requerimiento, user story o tarea relacionada con definiciones de comportamiento o criterios de aceptacion claros.",
                    "No clasifiques como criterio_fallido solo porque el Error QA compare resultado obtenido versus resultado esperado; esa forma de registro por si sola no prueba que exista un criterio incumplido en la definicion inicial.",
                    "Si el Error QA menciona explicitamente el criterio de aceptacion no cumplido del ticket original, podes usar criterio_fallido aunque el texto del ticket relacionado no este completo.",
                    "Si no hay criterio de aceptacion o comportamiento definido identificable, elegi otra causaError mas adecuada como definicion_incompleta, regresion, detalle_menor, oportunidad_de_mejora, problema_de_integracion, problema_de_datos, problema_de_entorno, error_de_usuario o caso_borde.",
                    "severidadError debe elegirse solo entre: bloqueante, critico, alto, medio, bajo.",
                    "tipoError debe elegirse solo entre: funcional, regla_de_negocio, validacion, seguridad, performance, interfaz, integracion, integridad_de_datos, compatibilidad, configuracion, infraestructura.",
                    "observationError debe explicar en texto breve que se encontro al analizar el error y justificar la causaError, tipoError y severidadError elegidas.",
                    "criterioError debe indicar especificamente que criterio de aceptacion o comportamiento definido no se esta cumpliendo, citando o parafraseando el criterio del Error QA o del ticket relacionado. Si solo existe resultado esperado/obtenido sin criterio identificable, devolve null.",
                    "nivelDetectabilidadDesarrollo mide que tan evidente o evitable era el error para desarrollo.",
                    "Responde en espanol neutro y sin texto extra.",
                ],
                userPromptLines: [
                    "Genera el analisis especifico de error del siguiente Redmine issue.",
                ],
            });
            errorAnalysis = this.normalizeAnalysisForPersistence(errorStage.analysis);
        }

        let storyQualityAnalysis: Partial<IStoryQualityAnalysis> = this.clearFields(STORY_QUALITY_FIELDS);
        if (shouldAnalyzeStoryQuality) {
            const storyStage = await this.executeAnalysisStage({
                request,
                issue,
                relatedContextIssues,
                schema: RedmineIssueStoryQualityPromptSchema,
                operationTitle: "redmine-issue-analysis-story-quality",
                systemPromptLines: [
                    "Sos un analista funcional especializado en calidad de user stories y definicion funcional.",
                    "Analiza un issue y devolve exclusivamente un JSON valido que respete el schema indicado.",
                    "Esta es la ETAPA 3: analisis de calidad de user story o ticket funcional.",
                    "Usa solo la informacion disponible en el ticket.",
                    "Todos los campos del JSON deben estar presentes.",
                    "Si un dato no se puede inferir con razon suficiente, devolvelo como null.",
                    "Evalua calidadCriteriosAceptacion, atomicidad, ambiguedadDefinicion, claridadAlcance, testabilidad, consistencia, riesgoErrorQA, requiereRefinamiento, cantidadObjetivosDetectados, hallazgosDefinicion y observacionesDefinicion.",
                    "hallazgosDefinicion debe usar solo valores del enum provisto por el schema.",
                    "cantidadObjetivosDetectados debe ser un entero mayor o igual a 0.",
                    "requiereRefinamiento debe ser true solo si falta definicion relevante para ejecutar, desarrollar o validar correctamente.",
                    "Responde en espanol neutro y sin texto extra.",
                ],
                userPromptLines: [
                    "Genera el analisis de calidad de user story del siguiente Redmine issue.",
                ],
            });
            storyQualityAnalysis = this.normalizeAnalysisForPersistence(storyStage.analysis);
        }

        return {
            ...baseAnalysis,
            ...errorAnalysis,
            ...storyQualityAnalysis,
        } as Omit<IRedmineIssueAnalysisBase, "redmineIssue">;
    }

    async analyzeIssue(request: CustomRequest, body: IAnalyzeIssuePayload): Promise<IAnalyzeIssueResult> {
        const redmineId = this.normalizeRequiredRedmineId(body.redmineId);
        const originalIssue = await this.findIssueByRedmineId(redmineId);

        if (!originalIssue) {
            throw new Error(`Redmine issue ${redmineId} was not found`);
        }

        const issue = this.applyDescriptionOverride(originalIssue, body.descriptionOverride);
        const analysis = await this.analyzeSingleIssue(request, issue);

        return {
            redmineId,
            analysis: {
                _id: `runtime-${issue.redmineId}-${Date.now()}`,
                redmineIssue: issue._id,
                issue: this.buildIssueSnapshot(issue),
                ...analysis,
            },
        };
    }

    async assistIssue(request: CustomRequest, body: IAssistIssuePayload): Promise<IAssistIssueResult> {
        const redmineId = this.normalizeRequiredRedmineId(body.redmineId);
        const issue = await this.findIssueByRedmineId(redmineId);

        if (!issue) {
            throw new Error(`Redmine issue ${redmineId} was not found`);
        }

        const promptResponse = await this.aiProvider.prompt({
            systemPrompt: [
                "Sos un Analista funcional experto en refinamiento de historias de usuario.",
                "Tu objetivo es mejorar la redaccion funcional de un ticket Redmine para que sea claro, atomico, testeable y accionable.",
                "Debes conservar la intencion funcional original y no inventar reglas de negocio no presentes.",
                "Si falta informacion importante, proponela como preguntas o comentarios concretos.",
                "Devolve exclusivamente un JSON valido con descripcionPropuesta y preguntasComentarios.",
                "descripcionPropuesta debe ser una descripcion completa lista para pegar en Redmine.",
                "preguntasComentarios debe ayudar a una nueva iteracion de refinamiento.",
                "Responde en espanol neutro.",
            ].join("\n"),
            userInput: [
                "Ticket original:",
                JSON.stringify(this.buildPromptIssueSnapshot(issue), null, 2),
                "Analisis funcional disponible:",
                JSON.stringify(body.analysis ?? null, null, 2),
                "Descripcion actual a mejorar:",
                body.currentDescription ?? issue.description ?? "",
                "Pedido adicional del usuario:",
                body.userInput ?? "",
            ].join("\n\n"),
            zodSchema: RedmineIssueAssistPromptSchema,
            operationTitle: "redmine-issue-assist-story-description",
            operationGroup: "redmine",
            ip: request.ip,
            userAgent: request.headers["user-agent"],
            tenant: request.rbac?.tenantId ?? null,
            user: request.rbac?.userId ?? null,
        });

        const parsedOutput = RedmineIssueAssistPromptSchema.parse(this.parseAiOutput(promptResponse.output));

        return {
            ...parsedOutput,
            tokens: promptResponse.tokens,
            inputTokens: promptResponse.inputTokens,
            outputTokens: promptResponse.outputTokens,
            time: promptResponse.time,
        };
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
            {field: "closedOn", operator: "gte", value: fromStart},
            {field: "closedOn", operator: "lte", value: toEnd},
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
            try {
                const action = await this.analyzeAndPersistIssueWithRetry(request, issue);
                result[action] += 1;
            } catch (error: any) {
                result.failed += 1;
                result.errors.push({
                    redmineIssueId: issue._id,
                    subject: issue.subject ?? `#${issue.redmineId}`,
                    message: `Failed after ${RedmineIssueAnalyzer.ANALYZE_ISSUE_MAX_ATTEMPTS} attempts: ${error?.message ?? "Unknown analysis error"}`,
                });
            }
        }

        return result;
    }
}

export default RedmineIssueAnalyzer;
export type {
    IAnalyzeIssuePayload,
    IAnalyzeIssueResult,
    IAnalyzeIssueError,
    IAnalyzeIssuesPayload,
    IAnalyzeIssuesResult,
    IAssistIssuePayload,
    IAssistIssueResult,
};
export {
    RedmineIssueAnalyzer,
};
