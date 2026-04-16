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
      {title: 'objetivo', key: 'objetivo', align: 'start'},
      {title: 'valorNegocio', key: 'valorNegocio', align: 'start'},
      {title: 'complejidad', key: 'complejidad', align: 'start'},
      {title: 'nivelUrgencia', key: 'nivelUrgencia', align: 'start'},
      {title: 'nivelDetectabilidadDesarrollo', key: 'nivelDetectabilidadDesarrollo', align: 'start'},
      {title: 'tipoTrabajoTecnico', key: 'tipoTrabajoTecnico', align: 'start'},
      {title: 'resumen', key: 'resumen', align: 'start'},
      {title: 'seniales', key: 'seniales', align: 'start'},
      {title: 'areaFuncional', key: 'areaFuncional', align: 'start'},
      {title: 'rolObjetivo', key: 'rolObjetivo', align: 'start'},
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
        enum: ['falla_de_aceptacion', 'regresion', 'definicion_incompleta', 'detalle_menor', 'oportunidad_de_mejora', 'problema_de_integracion', 'problema_de_datos', 'problema_de_entorno', 'error_de_usuario', 'caso_borde']
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
        name: 'objetivo',
        type: 'enum',
        label: 'objetivo',
        default: null,
        groupTab: 'Clasificacion',
        enum: ['nueva_capacidad', 'correccion_de_falla', 'estabilidad', 'reduccion_de_deuda_tecnica', 'soporte_operativo', 'cumplimiento', 'mejora_experiencia_usuario', 'reduccion_de_costos', 'investigacion', 'automatizacion', 'escalabilidad', 'observabilidad', 'otro']
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
      }
    ]
  }

  get filters(): IEntityCrudFilter[] {
    return [
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
    return false
  }

  get tabs() {
    return [
      'General', 'Clasificacion', 'Seniales'
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
