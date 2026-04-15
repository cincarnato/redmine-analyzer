
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from '../interfaces/IRedmineIssueAnalysis'

class RedmineIssueAnalysisProvider extends AbstractCrudRestProvider<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase> {
    
  static singleton: RedmineIssueAnalysisProvider
    
  constructor() {
   super('/api/redmine-issue-analyses')
  }
  
  static get instance() {
    if(!RedmineIssueAnalysisProvider.singleton){
      RedmineIssueAnalysisProvider.singleton = new RedmineIssueAnalysisProvider()
    }
    return RedmineIssueAnalysisProvider.singleton
  }

}

export default RedmineIssueAnalysisProvider

