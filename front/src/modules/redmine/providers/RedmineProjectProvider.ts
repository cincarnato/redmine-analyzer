
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IRedmineProject, IRedmineProjectBase} from '../interfaces/IRedmineProject'

class RedmineProjectProvider extends AbstractCrudRestProvider<IRedmineProject, IRedmineProjectBase, IRedmineProjectBase> {
    
  static singleton: RedmineProjectProvider
    
  constructor() {
   super('/api/redmine-projects')
  }
  
  static get instance() {
    if(!RedmineProjectProvider.singleton){
      RedmineProjectProvider.singleton = new RedmineProjectProvider()
    }
    return RedmineProjectProvider.singleton
  }

}

export default RedmineProjectProvider

