
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IRedmineIssue, IRedmineIssueBase} from '../interfaces/IRedmineIssue'

class RedmineIssueProvider extends AbstractCrudRestProvider<IRedmineIssue, IRedmineIssueBase, IRedmineIssueBase> {
    
  static singleton: RedmineIssueProvider
    
  constructor() {
   super('/api/redmine-issues')
  }
  
  static get instance() {
    if(!RedmineIssueProvider.singleton){
      RedmineIssueProvider.singleton = new RedmineIssueProvider()
    }
    return RedmineIssueProvider.singleton
  }

}

export default RedmineIssueProvider

