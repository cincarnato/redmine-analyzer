interface IRedmineProjectOption {
  id: number | string
  name: string
  identifier?: string
}

interface IRedmineStatusOption {
  id: number | string
  name: string
  isClosed?: boolean
}

type RedmineIssueSyncDateField = 'created_on' | 'closed_on'

interface IRedmineIssueSyncPayload {
  projectId: number | string
  dateFrom: string
  dateTo: string
  dateField?: RedmineIssueSyncDateField
  statusIds?: Array<number | string>
  includeJournals?: boolean
}

interface IRedmineIssueSyncResult {
  projectId: number | string
  dateFrom: string
  dateTo: string
  dateField?: RedmineIssueSyncDateField
  statusIds?: Array<number | string>
  includeJournals?: boolean
  total: number
  created: number
  updated: number
}

export type {
  IRedmineProjectOption,
  IRedmineStatusOption,
  RedmineIssueSyncDateField,
  IRedmineIssueSyncPayload,
  IRedmineIssueSyncResult
}
