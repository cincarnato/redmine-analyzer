import {UserCrud, RoleCrud, TenantCrud} from "@drax/identity-vue"
import { useEntityStore } from '@drax/crud-vue'
import { FileEntityCrud } from '@drax/media-vue'
import RedmineIssueAnalysisCrud from '../modules/redmine/cruds/RedmineIssueAnalysisCrud'
import RedmineIssueCrud from '../modules/redmine/cruds/RedmineIssueCrud'

function setupEntities(){
  const entityStore = useEntityStore()
  entityStore.addEntity(UserCrud.instance)
  entityStore.addEntity(RoleCrud.instance)
  entityStore.addEntity(TenantCrud.instance)
  entityStore.addEntity(FileEntityCrud.instance)
  entityStore.addEntity(RedmineIssueAnalysisCrud.instance)
  entityStore.addEntity(RedmineIssueCrud.instance)
  //TODO Add domain entities here...

}

export default setupEntities
