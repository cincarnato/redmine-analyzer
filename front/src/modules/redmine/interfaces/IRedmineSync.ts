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

interface IRedmineIssueSyncPayload {
  projectId: number | string
  dateFrom: string
  dateTo: string
  statusIds?: Array<number | string>
  includeJournals?: boolean
}

interface IRedmineIssueSyncResult {
  projectId: number | string
  dateFrom: string
  dateTo: string
  statusIds?: Array<number | string>
  includeJournals?: boolean
  total: number
  created: number
  updated: number
}

export type {
  IRedmineProjectOption,
  IRedmineStatusOption,
  IRedmineIssueSyncPayload,
  IRedmineIssueSyncResult
}
