
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from '../interfaces/IRedmineIssueAnalysis'
import type {
  IRedmineIssueAnalysisRunPayload,
  IRedmineIssueAnalysisRunResult
} from "../interfaces/IRedmineIssueAnalysisRun";

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

  async analyzeIssues(payload: IRedmineIssueAnalysisRunPayload): Promise<IRedmineIssueAnalysisRunResult> {
    const url = '/api/redmine-issue-analyses/analyze'
    const result = await this.httpClient.post(url, payload, {timeout: 360000})
    return result as IRedmineIssueAnalysisRunResult
  }

}

export default RedmineIssueAnalysisProvider
