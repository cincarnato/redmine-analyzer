
const messages = {
  en: {

    redmineissue: {
          entity: 'RedmineIssue',
          menu: 'RedmineIssue',
          syncMenu: 'Sync Redmine Issues',
          crud: 'Manage RedmineIssue',
          field:{
                       redmineId:'redmineId',
           subject:'subject',
           description:'description',
           doneRatio:'doneRatio',
           isPrivate:'isPrivate',
           spentHours:'spentHours',
           totalSpentHours:'totalSpentHours',
           estimatedHours:'estimatedHours',
           totalEstimatedHours:'totalEstimatedHours',
           startDate:'startDate',
           dueDate:'dueDate',
           createdOn:'createdOn',
           updatedOn:'updatedOn',
           closedOn:'closedOn',
           project:'project',
           id: 'id',
           name: 'name',
           tracker:'tracker',
           status:'status',
           isClosed: 'isClosed',
           priority:'priority',
           author:'author',
           fixedVersion:'fixedVersion',
           journals:'journals',
           user:'user',
           notes:'notes',
           details:'details',
           property:'property',
           oldValue:'oldValue',
           newValue:'newValue',
           customFields:'customFields',
           value: 'value',
           syncSource:'syncSource',
           rawPayload:'rawPayload'
          }
      },
      permission: {
              'redmineissue:view': 'View RedmineIssue',
              'redmineissue:create': 'Create RedmineIssue',
              'redmineissue:update': 'Edit RedmineIssue',
              'redmineissue:delete': 'Delete RedmineIssue',
              'redmineissue:manage': 'Manage RedmineIssue',
      }
  },
  es: {
     redmineissue: {
          entity: 'RedmineIssue',
          menu: 'RedmineIssue',
          syncMenu: 'Sincronizar Redmine',
          crud: 'Gestionar RedmineIssue',
          field:{
                       redmineId:'redmineId',
           subject:'subject',
           description:'description',
           doneRatio:'doneRatio',
           isPrivate:'isPrivate',
           spentHours:'spentHours',
           totalSpentHours:'totalSpentHours',
           estimatedHours:'estimatedHours',
           totalEstimatedHours:'totalEstimatedHours',
           startDate:'startDate',
           dueDate:'dueDate',
           createdOn:'createdOn',
           updatedOn:'updatedOn',
           closedOn:'closedOn',
           project:'project',
           id: 'id',
           name: 'name',
           tracker:'tracker',
           status:'status',
           isClosed: 'isClosed',
           priority:'priority',
           author:'author',
           fixedVersion:'fixedVersion',
           journals:'journals',
           user:'user',
           notes:'notes',
           details:'details',
           property:'property',
           oldValue:'oldValue',
           newValue:'newValue',
           customFields:'customFields',
           value: 'value',
           syncSource:'syncSource',
           rawPayload:'rawPayload'
          }
      },
     permission: {
              'redmineissue:view': 'Ver RedmineIssue',
              'redmineissue:create': 'Crear RedmineIssue',
              'redmineissue:update': 'Editar RedmineIssue',
              'redmineissue:delete': 'Eliminar RedmineIssue',
              'redmineissue:manage': 'Gestionar RedmineIssue',
     }
  }
}

export default messages;
