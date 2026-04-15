
import {mongoose} from '@drax/common-back';
import {PaginateModel} from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2'
import type {IRedmineIssueAnalysis} from '../interfaces/IRedmineIssueAnalysis'
import {RedmineIssueSchema as RedmineIssueDocumentSchema} from './RedmineIssueModel.js'

const RedmineIssueSnapshotSchema = new mongoose.Schema(
    RedmineIssueDocumentSchema.obj,
    {
        _id: false,
        id: false,
    },
);

const RedmineIssueAnalysisSchema = new mongoose.Schema<IRedmineIssueAnalysis>({
            redmineIssue: {type: mongoose.Schema.Types.ObjectId, ref: 'RedmineIssue',  required: true, index: true, unique: true },
            redmineIssueSnapshot: {type: RedmineIssueSnapshotSchema, required: false },
            resumen: {type: String,   required: false, index: false, unique: false },
            categoria: {type: String,  enum: ['nueva_funcionalidad', 'error', 'soporte', 'mantenimiento', 'refactorizacion', 'investigacion', 'configuracion', 'documentacion', 'tarea_tecnica', 'integracion', 'optimizacion', 'seguridad', 'datos', 'infraestructura', 'otro'], required: false, index: false, unique: false },
            tipoObjetivo: {type: String,  enum: ['nueva_capacidad', 'correccion_de_falla', 'estabilidad', 'reduccion_de_deuda_tecnica', 'soporte_operativo', 'cumplimiento', 'mejora_experiencia_usuario', 'reduccion_de_costos', 'investigacion', 'automatizacion', 'escalabilidad', 'observabilidad', 'otro'], required: false, index: false, unique: false },
            nivelValor: {type: String,  enum: ['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto'], required: false, index: false, unique: false },
            nivelComplejidad: {type: String,  enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            nivelUrgencia: {type: String,  enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            esError: {type: Boolean,   required: false, index: false, unique: false },
            esRetrabajo: {type: Boolean,   required: false, index: false, unique: false },
            esCambioMenor: {type: Boolean,   required: false, index: false, unique: false },
            estaBloqueado: {type: Boolean,   required: false, index: false, unique: false },
            motivoRetrabajo: {type: String,  enum: ['correccion_de_error_en_produccion', 'correccion_de_error_previo_a_produccion', 'cambio_de_requerimiento', 'caso_no_contemplado', 'ajuste_funcional', 'ajuste_tecnico', 'refactorizacion_necesaria', 'problema_de_calidad', 'problema_de_testing', 'problema_de_comunicacion', 'dependencia_externa', 'desconocido'], required: false, index: false, unique: false },
            areasImpacto: [{type: String,  enum: ['backend', 'frontend', 'base_de_datos', 'infraestructura', 'devops', 'integraciones', 'seguridad', 'experiencia_usuario', 'datos', 'reporting', 'api', 'arquitectura', 'testing'], required: false, index: false, unique: false }],
            grupoObjetivo: {type: String,   required: false, index: false, unique: false },
            areaFuncional: {type: String,   required: false, index: false, unique: false },
            resultadoProbable: {type: String,  enum: ['valor_directo_para_negocio', 'mejora_de_calidad', 'continuidad_operativa', 'reduccion_de_riesgo', 'mejora_tecnica_interna', 'habilitador_para_trabajo_futuro', 'bajo_valor_visible', 'sin_valor_claro'], required: false, index: false, unique: false },
            senialesDesperdicio: [{type: String,  enum: ['requerimiento_poco_claro', 'cambio_muy_pequenio', 'exceso_de_coordinacion', 'retrabajo', 'operacion_manual', 'bajo_impacto_de_negocio', 'duplicacion_de_esfuerzo', 'dependencia_evita_avance', 'analisis_excesivo', 'espera_prolongada'], required: false, index: false, unique: false }],
            senialesProceso: [{type: String,  enum: ['buena_definicion', 'mala_definicion', 'cambio_de_alcance', 'demora_por_dependencia', 'gap_de_testing', 'resolucion_rapida', 'estimacion_desviada', 'prioridad_inestable', 'falta_de_contexto', 'buena_colaboracion', 'alto_ida_y_vuelta'], required: false, index: false, unique: false }],
            confianza: {type: Number,   required: false, index: false, unique: false }
}, {timestamps: true});

RedmineIssueAnalysisSchema.plugin(uniqueValidator, {message: 'validation.unique'});
RedmineIssueAnalysisSchema.plugin(mongoosePaginate);

RedmineIssueAnalysisSchema.virtual("id").get(function () {
    return this._id.toString();
});


RedmineIssueAnalysisSchema.set('toJSON', {getters: true, virtuals: true});

RedmineIssueAnalysisSchema.set('toObject', {getters: true, virtuals: true});

const MODEL_NAME = 'RedmineIssueAnalysis';
const COLLECTION_NAME = 'redmineissueanalyses';
const RedmineIssueAnalysisModel = mongoose.model<IRedmineIssueAnalysis, PaginateModel<IRedmineIssueAnalysis>>(MODEL_NAME, RedmineIssueAnalysisSchema,COLLECTION_NAME);

export {
    RedmineIssueAnalysisSchema,
    RedmineIssueAnalysisModel
}

export default RedmineIssueAnalysisModel
