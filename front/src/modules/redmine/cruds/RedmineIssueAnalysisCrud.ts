import {EntityCrud} from "@drax/crud-vue";
import type {
  IDraxCrudProvider,
  IEntityCrud,
  IEntityCrudField,
  IEntityCrudFilter,
  IEntityCrudHeader,
  IEntityCrudPermissions,
  IEntityCrudRefs,
  IEntityCrudRules
} from "@drax/crud-share";
import RedmineIssueAnalysisProvider from "../providers/RedmineIssueAnalysisProvider";

//Import EntityCrud Refs
import RedmineIssueCrud from "./RedmineIssueCrud";

class RedmineIssueAnalysisCrud extends EntityCrud implements IEntityCrud {

  static singleton: RedmineIssueAnalysisCrud

  constructor() {
    super();
    this.name = 'RedmineIssueAnalysis'
  }

  static get instance(): RedmineIssueAnalysisCrud {
    if (!RedmineIssueAnalysisCrud.singleton) {
      RedmineIssueAnalysisCrud.singleton = new RedmineIssueAnalysisCrud()
    }
    return RedmineIssueAnalysisCrud.singleton
  }

  get permissions(): IEntityCrudPermissions {
    return {
      manage: 'redmineissueanalysis:manage',
      view: 'redmineissueanalysis:view',
      create: 'redmineissueanalysis:create',
      update: 'redmineissueanalysis:update',
      delete: 'redmineissueanalysis:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
      // {title: 'redmineIssue', key: 'redmineIssue', align: 'start'},
      {title: 'redmineId', key: 'issue.redmineId', align: 'start'},
      {title: 'subject', key: 'issue.subject', align: 'start'},
      {title: 'doneRatio', key: 'issue.doneRatio', align: 'start'},
      {title: 'isPrivate', key: 'issue.isPrivate', align: 'start'},
      {title: 'spentHours', key: 'issue.spentHours', align: 'start'},
      {title: 'startDate', key: 'issue.startDate', align: 'start'},
      {title: 'dueDate', key: 'issue.dueDate', align: 'start'},
      {title: 'createdOn', key: 'issue.createdOn', align: 'start'},
      {title: 'updatedOn', key: 'issue.updatedOn', align: 'start'},
      {title: 'closedOn', key: 'issue.closedOn', align: 'start'},
      {title: 'project', key: 'issue.project', align: 'start'},
      {title: 'tracker', key: 'issue.tracker', align: 'start'},
      {title: 'status', key: 'issue.status', align: 'start'},
      {title: 'priority', key: 'issue.priority', align: 'start'},
      {title: 'author', key: 'issue.author', align: 'start'},
      {title: 'fixedVersion', key: 'issue.fixedVersion', align: 'start'},
      {title: 'categoria', key: 'categoria', align: 'start'},
      {title: 'causaError', key: 'causaError', align: 'start'},
      {title: 'severidadError', key: 'severidadError', align: 'start'},
      {title: 'tipoError', key: 'tipoError', align: 'start'},
      {title: 'modulo', key: 'modulo', align: 'start'},
      {title: 'objetivo', key: 'objetivo', align: 'start'},
      {title: 'objetivoPropuesto', key: 'objetivoPropuesto', align: 'start'},
      {title: 'moduloPropuesto', key: 'moduloPropuesto', align: 'start'},
      {title: 'valorNegocio', key: 'valorNegocio', align: 'start'},
      {title: 'complejidad', key: 'complejidad', align: 'start'},
      {title: 'nivelUrgencia', key: 'nivelUrgencia', align: 'start'},
      {title: 'nivelDetectabilidadDesarrollo', key: 'nivelDetectabilidadDesarrollo', align: 'start'},
      {title: 'tipoTrabajoTecnico', key: 'tipoTrabajoTecnico', align: 'start'},
      {title: 'resumen', key: 'resumen', align: 'start'},
      {title: 'seniales', key: 'seniales', align: 'start'},
      {title: 'areaFuncional', key: 'areaFuncional', align: 'start'},
      {title: 'rolObjetivo', key: 'rolObjetivo', align: 'start'},
      {title: 'calidadCriteriosAceptacion', key: 'calidadCriteriosAceptacion', align: 'start'},
      {title: 'atomicidad', key: 'atomicidad', align: 'start'},
      {title: 'ambiguedadDefinicion', key: 'ambiguedadDefinicion', align: 'start'},
      {title: 'claridadAlcance', key: 'claridadAlcance', align: 'start'},
      {title: 'testabilidad', key: 'testabilidad', align: 'start'},
      {title: 'consistencia', key: 'consistencia', align: 'start'},
      {title: 'riesgoErrorQA', key: 'riesgoErrorQA', align: 'start'},
      {title: 'requiereRefinamiento', key: 'requiereRefinamiento', align: 'start'},
      {title: 'cantidadObjetivosDetectados', key: 'cantidadObjetivosDetectados', align: 'start'},
      {title: 'hallazgosDefinicion', key: 'hallazgosDefinicion', align: 'start'},
      {title: 'observacionesDefinicion', key: 'observacionesDefinicion', align: 'start'},
    ]
  }

  get selectedHeaders(): string[] {
    return this.headers.map(header => header.key)
  }

  get actionHeaders(): IEntityCrudHeader[] {
    return [
      {
        title: 'action.actions',
        key: 'actions',
        sortable: false,
        align: 'center',
        minWidth: '190px',
        fixed: 'end'
      },
    ]
  }

  get provider(): IDraxCrudProvider<any, any, any> {
    return RedmineIssueAnalysisProvider.instance
  }

  get refs(): IEntityCrudRefs {
    return {
      RedmineIssue: RedmineIssueCrud.instance
    }
  }

  get rules(): IEntityCrudRules {
    return {
      redmineIssue: [(v: any) => !!v || 'validation.required']
    }
  }

  get fields(): IEntityCrudField[] {
    return [
      {
        name: 'redmineIssue',
        type: 'ref',
        label: 'redmineIssue',
        default: null,
        groupTab: 'General',
        ref: 'RedmineIssue',
        refDisplay: 'subject'
      },
      {
        name: 'issue',
        type: 'object',
        label: 'issue',
        default: null,
        groupTab: 'General',
        objectFields: [
          {name: 'redmineId', type: 'number', label: 'redmineId', default: null},
          {name: 'subject', type: 'string', label: 'subject', default: ''},
          {name: 'description', type: 'longString', label: 'description', default: ''},
          {name: 'doneRatio', type: 'number', label: 'doneRatio', default: 0},
          {name: 'isPrivate', type: 'boolean', label: 'isPrivate', default: false},
          {name: 'spentHours', type: 'number', label: 'spentHours', default: 0},
          {name: 'totalSpentHours', type: 'number', label: 'totalSpentHours', default: 0},
          {name: 'estimatedHours', type: 'number', label: 'estimatedHours', default: null},
          {name: 'totalEstimatedHours', type: 'number', label: 'totalEstimatedHours', default: null},
          {name: 'startDate', type: 'date', label: 'startDate', default: null},
          {name: 'dueDate', type: 'date', label: 'dueDate', default: null},
          {name: 'createdOn', type: 'date', label: 'createdOn', default: null},
          {name: 'updatedOn', type: 'date', label: 'updatedOn', default: null},
          {name: 'closedOn', type: 'date', label: 'closedOn', default: null},
          {
            name: 'project',
            type: 'object',
            label: 'project',
            default: {id: null, name: ''},
            objectFields: [
              {name: 'id', type: 'number', label: 'id', default: null},
              {name: 'name', type: 'string', label: 'name', default: ''}
            ]
          },
          {
            name: 'tracker',
            type: 'object',
            label: 'tracker',
            default: {id: null, name: ''},
            objectFields: [
              {name: 'id', type: 'number', label: 'id', default: null},
              {name: 'name', type: 'string', label: 'name', default: ''}
            ]
          },
          {
            name: 'status',
            type: 'object',
            label: 'status',
            default: {id: null, name: '', isClosed: false},
            objectFields: [
              {name: 'id', type: 'number', label: 'id', default: null},
              {name: 'name', type: 'string', label: 'name', default: ''},
              {name: 'isClosed', type: 'boolean', label: 'isClosed', default: false}
            ]
          },
          {
            name: 'priority',
            type: 'object',
            label: 'priority',
            default: {id: null, name: ''},
            objectFields: [
              {name: 'id', type: 'number', label: 'id', default: null},
              {name: 'name', type: 'string', label: 'name', default: ''}
            ]
          },
          {
            name: 'author',
            type: 'object',
            label: 'author',
            default: {id: null, name: ''},
            objectFields: [
              {name: 'id', type: 'number', label: 'id', default: null},
              {name: 'name', type: 'string', label: 'name', default: ''}
            ]
          },
          {
            name: 'fixedVersion',
            type: 'object',
            label: 'fixedVersion',
            default: {id: null, name: ''},
            objectFields: [
              {name: 'id', type: 'number', label: 'id', default: null},
              {name: 'name', type: 'string', label: 'name', default: ''}
            ]
          },
          {
            name: 'journals',
            type: 'array.object',
            label: 'journals',
            default: [],
            objectFields: [
              {name: 'id', type: 'number', label: 'id', default: null},
              {
                name: 'user',
                type: 'object',
                label: 'user',
                default: {id: null, name: ''},
                objectFields: [
                  {name: 'id', type: 'number', label: 'id', default: null},
                  {name: 'name', type: 'string', label: 'name', default: ''}
                ]
              },
              {name: 'notes', type: 'longString', label: 'notes', default: ''},
              {name: 'createdOn', type: 'date', label: 'createdOn', default: null},
              {
                name: 'details',
                type: 'array.object',
                label: 'details',
                default: [],
                objectFields: [
                  {name: 'property', type: 'string', label: 'property', default: ''},
                  {name: 'name', type: 'string', label: 'name', default: ''},
                  {name: 'oldValue', type: 'string', label: 'oldValue', default: ''},
                  {name: 'newValue', type: 'string', label: 'newValue', default: ''}
                ]
              }
            ]
          },
          {
            name: 'customFields',
            type: 'array.object',
            label: 'customFields',
            default: [],
            objectFields: [
              {name: 'id', type: 'number', label: 'id', default: null},
              {name: 'name', type: 'string', label: 'name', default: ''},
              {name: 'value', type: 'string', label: 'value', default: ''}
            ]
          },
          {name: 'syncSource', type: 'string', label: 'syncSource', default: 'redmine'},
          {name: 'rawPayload', type: 'record', label: 'rawPayload', default: null}
        ]
      },
      {name: 'resumen', type: 'longString', label: 'resumen', default: '', groupTab: 'General'},
      {
        name: 'categoria',
        type: 'enum',
        label: 'categoria',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['nueva_funcionalidad', 'error', 'soporte', 'mantenimiento', 'refactorizacion', 'investigacion', 'configuracion', 'documentacion', 'tarea_tecnica', 'integracion', 'optimizacion', 'seguridad', 'datos', 'infraestructura', 'otro']
      },
      {
        name: 'causaError',
        type: 'enum',
        label: 'causaError',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['criterio_fallido', 'regresion', 'definicion_incompleta', 'detalle_menor', 'oportunidad_de_mejora', 'problema_de_integracion', 'problema_de_datos', 'problema_de_entorno', 'error_de_usuario', 'caso_borde']
      },
      {
        name: 'severidadError',
        type: 'enum',
        label: 'severidadError',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['bloqueante', 'critico', 'alto', 'medio', 'bajo']
      },
      {
        name: 'tipoError',
        type: 'enum',
        label: 'tipoError',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['funcional', 'regla_de_negocio', 'validacion', 'seguridad', 'performance', 'interfaz', 'integracion', 'integridad_de_datos', 'compatibilidad', 'configuracion', 'infraestructura']
      },
      {
        name: 'modulo',
        type: 'string',
        label: 'modulo',
        default: '',
        groupTab: 'Clasificacion'
      },
      {
        name: 'objetivo',
        type: 'string',
        label: 'objetivo',
        default: '',
        groupTab: 'Clasificacion'
      },
      {
        name: 'objetivoPropuesto',
        type: 'string',
        label: 'objetivoPropuesto',
        default: '',
        groupTab: 'Clasificacion'
      },
      {
        name: 'moduloPropuesto',
        type: 'string',
        label: 'moduloPropuesto',
        default: '',
        groupTab: 'Clasificacion'
      },
      {
        name: 'valorNegocio',
        type: 'enum',
        label: 'valorNegocio',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto']
      },
      {
        name: 'complejidad',
        type: 'enum',
        label: 'complejidad',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']
      },
      {
        name: 'nivelUrgencia',
        type: 'enum',
        label: 'nivelUrgencia',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']
      },
      {
        name: 'nivelDetectabilidadDesarrollo',
        type: 'enum',
        label: 'nivelDetectabilidadDesarrollo',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['muy_baja', 'baja', 'alta', 'muy_alta']
      },
      {
        name: 'tipoTrabajoTecnico',
        type: 'enum',
        label: 'tipoTrabajoTecnico',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['frontend', 'backend', 'fullstack']
      },
      {name: 'rolObjetivo', type: 'string', label: 'rolObjetivo', default: '', groupTab: 'Clasificacion'},
      {name: 'areaFuncional', type: 'string', label: 'areaFuncional', default: '', groupTab: 'Clasificacion'},
      {
        name: 'seniales',
        type: 'array.enum',
        label: 'seniales',
        default: [],
        groupTab: 'Seniales',
        enum: ['requerimiento_poco_claro', 'cambio_muy_pequenio', 'exceso_de_coordinacion', 'retrabajo', 'operacion_manual', 'bajo_impacto_de_negocio', 'duplicacion_de_esfuerzo', 'dependencia_evita_avance', 'analisis_excesivo', 'espera_prolongada', 'buena_definicion', 'mala_definicion', 'cambio_de_alcance', 'demora_por_dependencia', 'gap_de_testing', 'resolucion_rapida', 'estimacion_desviada', 'prioridad_inestable', 'falta_de_contexto', 'buena_colaboracion', 'alto_ida_y_vuelta']
      },
      {
        name: 'calidadCriteriosAceptacion',
        type: 'enum',
        label: 'calidadCriteriosAceptacion',
        default: null,
        groupTab: 'Definicion',
        enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']
      },
      {
        name: 'atomicidad',
        type: 'enum',
        label: 'atomicidad',
        default: null,
        groupTab: 'Definicion',
        enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']
      },
      {
        name: 'ambiguedadDefinicion',
        type: 'enum',
        label: 'ambiguedadDefinicion',
        default: null,
        groupTab: 'Definicion',
        enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']
      },
      {
        name: 'claridadAlcance',
        type: 'enum',
        label: 'claridadAlcance',
        default: null,
        groupTab: 'Definicion',
        enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']
      },
      {
        name: 'testabilidad',
        type: 'enum',
        label: 'testabilidad',
        default: null,
        groupTab: 'Definicion',
        enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']
      },
      {
        name: 'consistencia',
        type: 'enum',
        label: 'consistencia',
        default: null,
        groupTab: 'Definicion',
        enum: ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']
      },
      {
        name: 'riesgoErrorQA',
        type: 'enum',
        label: 'riesgoErrorQA',
        default: null,
        groupTab: 'Definicion',
        enum: ['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto']
      },
      {
        name: 'requiereRefinamiento',
        type: 'boolean',
        label: 'requiereRefinamiento',
        default: false,
        groupTab: 'Definicion'
      },
      {
        name: 'cantidadObjetivosDetectados',
        type: 'number',
        label: 'cantidadObjetivosDetectados',
        default: null,
        groupTab: 'Definicion'
      },
      {
        name: 'hallazgosDefinicion',
        type: 'array.enum',
        label: 'hallazgosDefinicion',
        default: [],
        groupTab: 'Definicion',
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
        ]
      },
      {
        name: 'observacionesDefinicion',
        type: 'longString',
        label: 'observacionesDefinicion',
        default: '',
        groupTab: 'Definicion'
      }
    ]
  }

  get filters(): IEntityCrudFilter[] {
    return [
      {name: 'issue.project.name', type: 'string', label: 'Proyecto', default: '', operator: 'like' },
      {name: 'issue.tracker.name', type: 'string', label: 'Tipo Ticket', default: '', operator: 'like' },
      {name: 'issue.createdOn', type: 'date', label: 'Creado Desde', default: '', operator: 'gte' },
      {name: 'issue.createdOn', type: 'date', label: 'Creado Hasta', default: '', operator: 'lte' },
      {name: 'issue.redmineId', type: 'string', label: 'Redmine ID', default: '', operator: 'eq' },
      {name: 'issue.fixedVersion.name', type: 'string', label: 'Sprint', default: '', operator: 'like' },
      {name: 'issue.closedOn', type: 'date', label: 'Cerrado Desde', default: '', operator: 'gte' },
      {name: 'issue.closedOn', type: 'date', label: 'Cerrado Hasta', default: '', operator: 'lte' },
    ]
  }

  get isViewable() {
    return true
  }

  get isEditable() {
    return true
  }

  get isCreatable() {
    return true
  }

  get isDeletable() {
    return true
  }

  get isExportable() {
    return true
  }

  get exportFormats() {
    return ['CSV', 'JSON']
  }

  get exportHeaders() {
    return ['_id']
  }

  get isImportable() {
    return false
  }

  get isColumnSelectable() {
    return true
  }

  get isGroupable() {
    return true
  }

  get importFormats() {
    return ['CSV', 'JSON']
  }

  get dialogFullscreen() {
    return true
  }

  get tabs() {
    return [
      'General', 'Clasificacion', 'Seniales', 'Definicion'
    ]
  }

  get menus() {
    return []
  }

  get searchEnable() {
    return false
  }

  get filtersEnable() {
    return true
  }

  get dynamicFiltersEnable() {
    return true
  }



}

export default RedmineIssueAnalysisCrud
