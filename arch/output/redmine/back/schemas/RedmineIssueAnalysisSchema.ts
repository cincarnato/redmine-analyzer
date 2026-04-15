
import { z } from 'zod';


const RedmineIssueAnalysisBaseSchema = z.object({
      redmineIssue: z.coerce.string().min(1,'validation.required'),
    resumen: z.string().optional(),
    categoria: z.enum(['nueva_funcionalidad', 'error', 'soporte', 'mantenimiento', 'refactorizacion', 'investigacion', 'configuracion', 'documentacion', 'tarea_tecnica', 'integracion', 'optimizacion', 'seguridad', 'datos', 'infraestructura', 'otro']).optional(),
    tipoObjetivo: z.enum(['nueva_capacidad', 'correccion_de_falla', 'estabilidad', 'reduccion_de_deuda_tecnica', 'soporte_operativo', 'cumplimiento', 'mejora_experiencia_usuario', 'reduccion_de_costos', 'investigacion', 'automatizacion', 'escalabilidad', 'observabilidad', 'otro']).optional(),
    nivelValor: z.enum(['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto']).optional(),
    nivelComplejidad: z.enum(['muy_baja', 'baja', 'media', 'alta', 'muy_alta']).optional(),
    nivelUrgencia: z.enum(['muy_baja', 'baja', 'media', 'alta', 'muy_alta']).optional(),
    esError: z.boolean().optional(),
    esRetrabajo: z.boolean().optional(),
    esCambioMenor: z.boolean().optional(),
    estaBloqueado: z.boolean().optional(),
    motivoRetrabajo: z.enum(['correccion_de_error_en_produccion', 'correccion_de_error_previo_a_produccion', 'cambio_de_requerimiento', 'caso_no_contemplado', 'ajuste_funcional', 'ajuste_tecnico', 'refactorizacion_necesaria', 'problema_de_calidad', 'problema_de_testing', 'problema_de_comunicacion', 'dependencia_externa', 'desconocido']).optional(),
    areasImpacto: z.array(z.enum(['backend', 'frontend', 'base_de_datos', 'infraestructura', 'devops', 'integraciones', 'seguridad', 'experiencia_usuario', 'datos', 'reporting', 'api', 'arquitectura', 'testing'])).optional(),
    grupoObjetivo: z.string().optional(),
    areaFuncional: z.string().optional(),
    resultadoProbable: z.enum(['valor_directo_para_negocio', 'mejora_de_calidad', 'continuidad_operativa', 'reduccion_de_riesgo', 'mejora_tecnica_interna', 'habilitador_para_trabajo_futuro', 'bajo_valor_visible', 'sin_valor_claro']).optional(),
    senialesDesperdicio: z.array(z.enum(['requerimiento_poco_claro', 'cambio_muy_pequenio', 'exceso_de_coordinacion', 'retrabajo', 'operacion_manual', 'bajo_impacto_de_negocio', 'duplicacion_de_esfuerzo', 'dependencia_evita_avance', 'analisis_excesivo', 'espera_prolongada'])).optional(),
    senialesProceso: z.array(z.enum(['buena_definicion', 'mala_definicion', 'cambio_de_alcance', 'demora_por_dependencia', 'gap_de_testing', 'resolucion_rapida', 'estimacion_desviada', 'prioridad_inestable', 'falta_de_contexto', 'buena_colaboracion', 'alto_ida_y_vuelta'])).optional(),
    confianza: z.number().nullable().optional()
});

const RedmineIssueAnalysisSchema = RedmineIssueAnalysisBaseSchema
    .extend({
      _id: z.coerce.string(),
       redmineIssue: z.object({_id: z.coerce.string(), subject: z.string()})
    })

export default RedmineIssueAnalysisSchema;
export {RedmineIssueAnalysisSchema, RedmineIssueAnalysisBaseSchema}
