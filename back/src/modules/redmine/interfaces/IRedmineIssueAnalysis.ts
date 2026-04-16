
import type {IRedmineIssue, IRedmineIssueBase} from "./IRedmineIssue";

interface IRedmineIssueAnalysisBase {
    redmineIssue: any
    issue?: IRedmineIssueBase
    resumen?: string
    categoria?: string
    causaError?: string
    severidadError?: string
    tipoError?: string
    objetivo?: string
    valorNegocio?: string
    complejidad?: string
    nivelUrgencia?: string
    nivelDetectabilidadDesarrollo?: string
    tipoTrabajoTecnico?: string
    rolObjetivo?: string
    areaFuncional?: string
    seniales?: Array<string>
    createdAt?: Date
    updatedAt?: Date
}

interface IRedmineIssueAnalysis {
    _id: string
    redmineIssue: any
    issue?: IRedmineIssueBase | IRedmineIssue
    resumen?: string
    categoria?: string
    causaError?: string
    severidadError?: string
    tipoError?: string
    objetivo?: string
    valorNegocio?: string
    complejidad?: string
    nivelUrgencia?: string
    nivelDetectabilidadDesarrollo?: string
    tipoTrabajoTecnico?: string
    rolObjetivo?: string
    areaFuncional?: string
    seniales?: Array<string>
    createdAt?: Date
    updatedAt?: Date
}

export type {
IRedmineIssueAnalysisBase, 
IRedmineIssueAnalysis
}
