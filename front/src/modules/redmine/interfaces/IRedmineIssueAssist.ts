import type {IRedmineIssueAnalysis} from './IRedmineIssueAnalysis'

interface IRedmineIssueAnalyzeOnePayload {
  redmineId: number | string
  descriptionOverride?: string
}

interface IRedmineIssueAnalyzeOneResult {
  redmineId: number
  analysis: IRedmineIssueAnalysis
}

interface IRedmineIssueAssistPayload {
  redmineId: number | string
  currentDescription?: string
  userInput?: string
  analysis?: Partial<IRedmineIssueAnalysis>
}

interface IRedmineIssueAssistResult {
  descripcionPropuesta: string
  preguntasComentarios: string[]
  tokens: number
  inputTokens: number
  outputTokens: number
  time: number
}

export type {
  IRedmineIssueAnalyzeOnePayload,
  IRedmineIssueAnalyzeOneResult,
  IRedmineIssueAssistPayload,
  IRedmineIssueAssistResult
}
