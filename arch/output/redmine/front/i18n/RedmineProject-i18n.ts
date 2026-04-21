
const messages = {
  en: {
  
    redmineproject: {
          entity: 'RedmineProject',
          menu: 'RedmineProject',
          crud: 'Manage RedmineProject',
          field:{
                       redmineId:'redmineId',
           name:'name',
           goals:'goals',
           name: 'name',
           description: 'description'
          }
      },
      permission: {
              'redmineproject:view': 'View RedmineProject',
              'redmineproject:create': 'Create RedmineProject',
              'redmineproject:update': 'Edit RedmineProject',
              'redmineproject:delete': 'Delete RedmineProject',
              'redmineproject:manage': 'Manage RedmineProject',
      }
  },
  es: {
     redmineproject: {
          entity: 'RedmineProject',
          menu: 'RedmineProject',
          crud: 'Gestionar RedmineProject',
          field:{
                       redmineId:'redmineId',
           name:'name',
           goals:'goals',
           name: 'name',
           description: 'description'
          }
      },
     permission: {
              'redmineproject:view': 'Ver RedmineProject',
              'redmineproject:create': 'Crear RedmineProject',
              'redmineproject:update': 'Editar RedmineProject',
              'redmineproject:delete': 'Eliminar RedmineProject',
              'redmineproject:manage': 'Gestionar RedmineProject',
     }
  }
}

export default messages;  
