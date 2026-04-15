interface IRedmineIssueAnalysisRunPayload {
  projectId: number | string
  dateFrom: string
  dateTo: string
  statusIds?: Array<number | string>
}

interface IRedmineIssueAnalysisRunError {
  redmineIssueId: string
  subject: string
  message: string
}

interface IRedmineIssueAnalysisRunResult {
  projectId: number | string
  dateFrom: string
  dateTo: string
  statusIds: Array<number | string>
  total: number
  created: number
  updated: number
  failed: number
  errors: IRedmineIssueAnalysisRunError[]
}

export type {
  IRedmineIssueAnalysisRunPayload,
  IRedmineIssueAnalysisRunError,
  IRedmineIssueAnalysisRunResult,
}
