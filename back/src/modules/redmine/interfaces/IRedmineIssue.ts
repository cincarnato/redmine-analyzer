interface IRedmineIssueJournalDetail {
    property?: string
    name?: string
    oldValue?: string
    newValue?: string
}

interface IRedmineIssueJournal {
    id: number
    user?: {
        id: number
        name: string
    }
    notes?: string
    createdOn?: Date
    details?: Array<IRedmineIssueJournalDetail>
}

interface IRedmineIssueBase {
    redmineId: number
    subject: string
    description?: string
    doneRatio?: number
    isPrivate?: boolean
    spentHours?: number
    totalSpentHours?: number
    estimatedHours?: number
    totalEstimatedHours?: number
    startDate?: Date
    dueDate?: Date
    createdOn: Date
    updatedOn: Date
    closedOn?: Date
    project: {
        id: number
        name: string
    }
    tracker: {
        id: number
        name: string
    }
    status: {
        id: number
        name: string
        isClosed?: boolean
    }
    priority: {
        id: number
        name: string
    }
    author: {
        id: number
        name: string
    }
    fixedVersion?: {
        id: number
        name: string
    }
    journals?: Array<IRedmineIssueJournal>
    customFields?: Array<{
        id: number
        name: string
        value?: string
    }>
    syncSource?: string
    rawPayload?: Record<string, any>
    createdAt?: Date
    updatedAt?: Date
}

interface IRedmineIssue {
    _id: string
    redmineId: number
    subject: string
    description?: string
    doneRatio?: number
    isPrivate?: boolean
    spentHours?: number
    totalSpentHours?: number
    estimatedHours?: number
    totalEstimatedHours?: number
    startDate?: Date
    dueDate?: Date
    createdOn: Date
    updatedOn: Date
    closedOn?: Date
    project: {
        id: number
        name: string
    }
    tracker: {
        id: number
        name: string
    }
    status: {
        id: number
        name: string
        isClosed?: boolean
    }
    priority: {
        id: number
        name: string
    }
    author: {
        id: number
        name: string
    }
    fixedVersion?: {
        id: number
        name: string
    }
    journals?: Array<IRedmineIssueJournal>
    customFields?: Array<{
        id: number
        name: string
        value?: string
    }>
    syncSource?: string
    rawPayload?: Record<string, any>
    createdAt?: Date
    updatedAt?: Date
}

export type {
    IRedmineIssueBase,
    IRedmineIssue,
    IRedmineIssueJournal,
    IRedmineIssueJournalDetail
}
