
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from '../interfaces/IRedmineIssueAnalysis'
import type {
  IRedmineIssueAnalysisRunPayload,
  IRedmineIssueAnalysisRunResult
} from "../interfaces/IRedmineIssueAnalysisRun";
import type {
  IRedmineIssueAnalyzeOnePayload,
  IRedmineIssueAnalyzeOneResult,
  IRedmineIssueAssistPayload,
  IRedmineIssueAssistResult
} from '../interfaces/IRedmineIssueAssist'

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
    const result = await this.httpClient.post(url, payload, {timeout: 960000})
    return result as IRedmineIssueAnalysisRunResult
  }

  async analyzeIssue(payload: IRedmineIssueAnalyzeOnePayload): Promise<IRedmineIssueAnalyzeOneResult> {
    const url = '/api/redmine-issue-analyses/analyze-one'
    const result = await this.httpClient.post(url, payload, {timeout: 240000})
    return result as IRedmineIssueAnalyzeOneResult
  }

  async assistIssue(payload: IRedmineIssueAssistPayload): Promise<IRedmineIssueAssistResult> {
    const url = '/api/redmine-issue-analyses/assist'
    const result = await this.httpClient.post(url, payload, {timeout: 240000})
    return result as IRedmineIssueAssistResult
  }

}

export default RedmineIssueAnalysisProvider
