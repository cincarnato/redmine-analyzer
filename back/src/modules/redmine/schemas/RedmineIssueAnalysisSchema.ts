
import { z } from 'zod';
import {RedmineIssueBaseSchema, RedmineIssueSchema as FullRedmineIssueSchema, jsonSafeDateSchema} from "./RedmineIssueSchema.js";


const RedmineIssueAnalysisBaseSchema = z.object({
    redmineIssue: z.coerce.string().min(1,'validation.required'),
    issue: RedmineIssueBaseSchema.optional(),
    resumen: z.string().nullish(),
    categoria: z.enum(['nueva_funcionalidad', 'error', 'soporte', 'mantenimiento', 'refactorizacion', 'investigacion', 'configuracion', 'documentacion', 'tarea_tecnica', 'integracion', 'optimizacion', 'seguridad', 'datos', 'infraestructura', 'otro']).nullish(),
    causaError: z.enum(['falla_de_aceptacion', 'regresion', 'definicion_incompleta', 'detalle_menor', 'oportunidad_de_mejora', 'problema_de_integracion', 'problema_de_datos', 'problema_de_entorno', 'error_de_usuario', 'caso_borde']).nullish(),
    severidadError: z.enum(['bloqueante', 'critico', 'alto', 'medio', 'bajo']).nullish(),
    tipoError: z.enum(['funcional', 'regla_de_negocio', 'validacion', 'seguridad', 'performance', 'interfaz', 'integracion', 'integridad_de_datos', 'compatibilidad', 'configuracion', 'infraestructura']).nullish(),
    objetivo: z.enum(['nueva_capacidad', 'correccion_de_falla', 'estabilidad', 'reduccion_de_deuda_tecnica', 'soporte_operativo', 'cumplimiento', 'mejora_experiencia_usuario', 'reduccion_de_costos', 'investigacion', 'automatizacion', 'escalabilidad', 'observabilidad', 'otro']).nullish(),
    valorNegocio: z.enum(['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto']).nullish(),
    complejidad: z.enum(['muy_baja', 'baja', 'media', 'alta', 'muy_alta']).nullish(),
    nivelUrgencia: z.enum(['muy_baja', 'baja', 'media', 'alta', 'muy_alta']).nullish(),
    nivelDetectabilidadDesarrollo: z.enum(['muy_baja', 'baja', 'alta', 'muy_alta']).nullish(),
    tipoTrabajoTecnico: z.enum(['frontend', 'backend', 'fullstack']).nullish(),
    rolObjetivo: z.string().nullish(),
    areaFuncional: z.string().nullish(),
    seniales: z.array(z.enum(['requerimiento_poco_claro', 'cambio_muy_pequenio', 'exceso_de_coordinacion', 'retrabajo', 'operacion_manual', 'bajo_impacto_de_negocio', 'duplicacion_de_esfuerzo', 'dependencia_evita_avance', 'analisis_excesivo', 'espera_prolongada', 'buena_definicion', 'mala_definicion', 'cambio_de_alcance', 'demora_por_dependencia', 'gap_de_testing', 'resolucion_rapida', 'estimacion_desviada', 'prioridad_inestable', 'falta_de_contexto', 'buena_colaboracion', 'alto_ida_y_vuelta'])).nullish()
});

const RedmineIssueAnalysisSchema = RedmineIssueAnalysisBaseSchema
    .extend({
        _id: z.coerce.string(),
        createdAt: jsonSafeDateSchema,
        updatedAt: jsonSafeDateSchema,
        redmineIssue: z.union([
            z.coerce.string(),
            z.object({_id: z.coerce.string(), subject: z.string()}),
        ]),
        issue: RedmineIssueBaseSchema.or(FullRedmineIssueSchema).optional(),
    })

export default RedmineIssueAnalysisSchema;
export {RedmineIssueAnalysisSchema, RedmineIssueAnalysisBaseSchema}
