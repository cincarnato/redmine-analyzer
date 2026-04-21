
const messages = {
  en: {
  
    redmineproject: {
          entity: 'Redmine Project',
          menu: 'Redmine Projects',
          crud: 'Manage Redmine Projects',
          field:{
           redmineId:'Redmine ID',
           name:'Name',
           goals:'Goals',
           modules:'Modules',
           goalName: 'Goal name',
           goalDescription: 'Goal description',
           moduleName: 'Module name',
           moduleDescription: 'Module description'
          }
      },
      permission: {
              'redmineproject:view': 'View Redmine project',
              'redmineproject:create': 'Create Redmine project',
              'redmineproject:update': 'Edit Redmine project',
              'redmineproject:delete': 'Delete Redmine project',
              'redmineproject:manage': 'Manage Redmine projects',
      }
  },
  es: {
     redmineproject: {
          entity: 'Proyecto Redmine',
          menu: 'Proyectos Redmine',
          crud: 'Gestionar proyectos Redmine',
          field:{
           redmineId:'ID Redmine',
           name:'Nombre',
           goals:'Objetivos',
           modules:'Modulos',
           goalName: 'Nombre del objetivo',
           goalDescription: 'Descripcion del objetivo',
           moduleName: 'Nombre del modulo',
           moduleDescription: 'Descripcion del modulo'
          }
      },
     permission: {
              'redmineproject:view': 'Ver proyecto Redmine',
              'redmineproject:create': 'Crear proyecto Redmine',
              'redmineproject:update': 'Editar proyecto Redmine',
              'redmineproject:delete': 'Eliminar proyecto Redmine',
              'redmineproject:manage': 'Gestionar proyectos Redmine',
     }
  }
}

export default messages;  
