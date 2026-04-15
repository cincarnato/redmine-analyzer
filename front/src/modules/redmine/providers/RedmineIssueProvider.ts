
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IRedmineIssue, IRedmineIssueBase} from '../interfaces/IRedmineIssue'
import type {
  IRedmineIssueSyncPayload,
  IRedmineIssueSyncResult,
  IRedmineProjectOption,
  IRedmineStatusOption
} from "../interfaces/IRedmineSync";

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

  async fetchProjects(): Promise<IRedmineProjectOption[]> {
    const url = '/api/redmine-sync/projects'
    const items = await this.httpClient.get(url)
    return items as IRedmineProjectOption[]
  }

  async fetchStatuses(): Promise<IRedmineStatusOption[]> {
    const url = '/api/redmine-sync/statuses'
    const items = await this.httpClient.get(url)
    return items as IRedmineStatusOption[]
  }

  async syncIssues(payload: IRedmineIssueSyncPayload): Promise<IRedmineIssueSyncResult> {
    const url = '/api/redmine-sync/issues'
    const result = await this.httpClient.post(url, payload, {timeout: 120000})
    return result as IRedmineIssueSyncResult
  }

}

export default RedmineIssueProvider
