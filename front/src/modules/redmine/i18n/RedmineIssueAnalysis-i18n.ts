
const messages = {
  en: {

    redmineissueanalysis: {
          entity: 'Issue analysis',
          menu: 'Issue analyses',
          runMenu: 'Analyze Redmine issues',
          crud: 'Manage issue analyses',
          field:{
           redmineIssue:'Redmine issue',
           'redmineId':'Snapshot Redmine ID',
           'subject':'Snapshot subject',
           'doneRatio':'Snapshot done ratio',
           'isPrivate':'Snapshot private',
           'spentHours':'Snapshot spent hours',
           'startDate':'Snapshot start date',
           'dueDate':'Snapshot due date',
           'createdOn':'Snapshot created on',
           'updatedOn':'Snapshot updated on',
           'closedOn':'Snapshot closed on',
           'project':'Snapshot project',
           'tracker':'Snapshot tracker',
           'status':'Snapshot status',
           'priority':'Snapshot priority',
           'author':'Snapshot author',
           'fixedVersion':'Snapshot fixed version',
           resumen:'Summary',
           categoria:'Category',
           causaError:'Error cause',
           severidadError:'Error severity',
           tipoError:'Error type',
           objetivo:'Objective',
           valorNegocio:'Business value',
           complejidad:'Complexity',
           nivelUrgencia:'Urgency level',
           rolObjetivo:'Target role',
           areaFuncional:'Functional area',
           seniales:'Signals'
          }
      },
      permission: {
              'redmineissueanalysis:view': 'View issue analysis',
              'redmineissueanalysis:create': 'Create issue analysis',
              'redmineissueanalysis:update': 'Edit issue analysis',
              'redmineissueanalysis:delete': 'Delete issue analysis',
              'redmineissueanalysis:manage': 'Manage issue analyses',
      }
  },
  es: {
     redmineissueanalysis: {
          entity: 'Analisis de issue',
          menu: 'Analisis de issues',
          runMenu: 'Analizar tickets Redmine',
          crud: 'Gestionar analisis de issues',
          field:{
           redmineIssue:'Issue de Redmine',
           'redmineId':'ID Redmine',
           'subject':'Asunto',
           'doneRatio':'Progreso',
           'isPrivate':'Privado',
           'spentHours':'Horas imputadas',
           'startDate':'Fecha de inicio',
           'dueDate':'Fecha de vencimiento',
           'createdOn':'Fecha de creacion',
           'updatedOn':'Fecha de actualizacion',
           'closedOn':'Fecha de cierre',
           'project':'Proyecto',
           'tracker':'Tracker',
           'status':'Estado',
           'priority':'Prioridad',
           'author':'Autor',
           'fixedVersion':'Version objetivo',
           resumen:'Resumen',
           categoria:'Categoria',
           causaError:'Causa del error',
           severidadError:'Severidad del error',
           tipoError:'Tipo de error',
           objetivo:'Objetivo',
           valorNegocio:'Valor de negocio',
           complejidad:'Complejidad',
           nivelUrgencia:'Nivel de urgencia',
           rolObjetivo:'Rol objetivo',
           areaFuncional:'Area funcional',
           seniales:'Seniales'
          }
      },
     permission: {
              'redmineissueanalysis:view': 'Ver analisis de issue',
              'redmineissueanalysis:create': 'Crear analisis de issue',
              'redmineissueanalysis:update': 'Editar analisis de issue',
              'redmineissueanalysis:delete': 'Eliminar analisis de issue',
              'redmineissueanalysis:manage': 'Gestionar analisis de issues',
     }
  }
}

export default messages;
