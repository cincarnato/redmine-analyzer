
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
            issue: {type: RedmineIssueSnapshotSchema, required: false },
            resumen: {type: String,   required: false, index: false, unique: false },
            categoria: {type: String,  enum: ['nueva_funcionalidad', 'error', 'soporte', 'mantenimiento', 'refactorizacion', 'investigacion', 'configuracion', 'documentacion', 'tarea_tecnica', 'integracion', 'optimizacion', 'seguridad', 'datos', 'infraestructura', 'otro'], required: false, index: false, unique: false },
            causaError: {type: String,  enum: ['falla_de_aceptacion', 'regresion', 'definicion_incompleta', 'detalle_menor', 'oportunidad_de_mejora', 'problema_de_integracion', 'problema_de_datos', 'problema_de_entorno', 'error_de_usuario', 'caso_borde'], required: false, index: false, unique: false },
            severidadError: {type: String,  enum: ['bloqueante', 'critico', 'alto', 'medio', 'bajo'], required: false, index: false, unique: false },
            tipoError: {type: String,  enum: ['funcional', 'regla_de_negocio', 'validacion', 'seguridad', 'performance', 'interfaz', 'integracion', 'integridad_de_datos', 'compatibilidad', 'configuracion', 'infraestructura'], required: false, index: false, unique: false },
            modulo: {type: String, required: false, index: false, unique: false },
            objetivo: {type: String, required: false, index: false, unique: false },
            objetivoPropuesto: {type: String, required: false, index: false, unique: false },
            moduloPropuesto: {type: String, required: false, index: false, unique: false },
            valorNegocio: {type: String,  enum: ['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto'], required: false, index: false, unique: false },
            complejidad: {type: String,  enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            nivelUrgencia: {type: String,  enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            nivelDetectabilidadDesarrollo: {type: String,  enum: ['muy_baja', 'baja', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            tipoTrabajoTecnico: {type: String,  enum: ['frontend', 'backend', 'fullstack'], required: false, index: false, unique: false },
            rolObjetivo: {type: String,   required: false, index: false, unique: false },
            areaFuncional: {type: String,   required: false, index: false, unique: false },
            seniales: [{type: String,  enum: ['requerimiento_poco_claro', 'cambio_muy_pequenio', 'exceso_de_coordinacion', 'retrabajo', 'operacion_manual', 'bajo_impacto_de_negocio', 'duplicacion_de_esfuerzo', 'dependencia_evita_avance', 'analisis_excesivo', 'espera_prolongada', 'buena_definicion', 'mala_definicion', 'cambio_de_alcance', 'demora_por_dependencia', 'gap_de_testing', 'resolucion_rapida', 'estimacion_desviada', 'prioridad_inestable', 'falta_de_contexto', 'buena_colaboracion', 'alto_ida_y_vuelta'], required: false, index: false, unique: false }],
            calidadCriteriosAceptacion: {type: String, enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            atomicidad: {type: String, enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            ambiguedadDefinicion: {type: String, enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            claridadAlcance: {type: String, enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            testabilidad: {type: String, enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            consistencia: {type: String, enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'], required: false, index: false, unique: false },
            riesgoErrorQA: {type: String, enum: ['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto'], required: false, index: false, unique: false },
            requiereRefinamiento: {type: Boolean, required: false, index: false, unique: false },
            cantidadObjetivosDetectados: {type: Number, required: false, min: 0, index: false, unique: false },
            hallazgosDefinicion: [{
                type: String,
                enum: [
                    'sin_criterios_de_aceptacion',
                    'criterios_demasiado_generales',
                    'criterios_no_verificables',
                    'criterios_incompletos',
                    'criterios_bien_definidos',
                    'historia_demasiado_grande',
                    'historia_bien_atomica',
                    'multiples_objetivos_en_un_mismo_ticket',
                    'descripcion_ambigua',
                    'descripcion_incompleta',
                    'alcance_poco_claro',
                    'alcance_bien_delimitado',
                    'falta_contexto_funcional',
                    'dependencia_no_explicitada',
                    'cambio_de_alcance_no_actualizado',
                    'comentarios_contradicen_descripcion',
                    'requiere_definicion_adicional',
                    'facil_de_validar'
                ],
                required: false,
                index: false,
                unique: false
            }],
            observacionesDefinicion: {type: String, required: false, index: false, unique: false }
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
