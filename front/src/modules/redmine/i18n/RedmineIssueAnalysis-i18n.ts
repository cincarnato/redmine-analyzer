
const messages = {
  en: {
  
    redmineissueanalysis: {
          entity: 'Issue analysis',
          menu: 'Issue analyses',
          runMenu: 'Analyze Redmine issues',
          crud: 'Manage issue analyses',
          field:{
           redmineIssue:'Redmine issue',
           resumen:'Summary',
           categoria:'Category',
           tipoObjetivo:'Objective type',
           nivelValor:'Value level',
           nivelComplejidad:'Complexity level',
           nivelUrgencia:'Urgency level',
           esError:'Is bug',
           esRetrabajo:'Is rework',
           esCambioMenor:'Is minor change',
           estaBloqueado:'Is blocked',
           motivoRetrabajo:'Rework reason',
           areasImpacto:'Impact areas',
           grupoObjetivo:'Target group',
           areaFuncional:'Functional area',
           resultadoProbable:'Expected result',
           senialesDesperdicio:'Waste signals',
           senialesProceso:'Process signals',
           confianza:'Confidence'
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
           resumen:'Resumen',
           categoria:'Categoria',
           tipoObjetivo:'Tipo de objetivo',
           nivelValor:'Nivel de valor',
           nivelComplejidad:'Nivel de complejidad',
           nivelUrgencia:'Nivel de urgencia',
           esError:'Es error',
           esRetrabajo:'Es retrabajo',
           esCambioMenor:'Es cambio menor',
           estaBloqueado:'Esta bloqueado',
           motivoRetrabajo:'Motivo de retrabajo',
           areasImpacto:'Areas de impacto',
           grupoObjetivo:'Grupo objetivo',
           areaFuncional:'Area funcional',
           resultadoProbable:'Resultado probable',
           senialesDesperdicio:'Seniales de desperdicio',
           senialesProceso:'Seniales de proceso',
           confianza:'Confianza'
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
