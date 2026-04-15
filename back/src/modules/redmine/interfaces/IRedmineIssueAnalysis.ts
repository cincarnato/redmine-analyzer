
import type {IRedmineIssue, IRedmineIssueBase} from "./IRedmineIssue";

interface IRedmineIssueAnalysisBase {
    redmineIssue: any
    issue?: IRedmineIssueBase
    resumen?: string
    categoria?: string
    tipoObjetivo?: string
    nivelValor?: string
    nivelComplejidad?: string
    nivelUrgencia?: string
    nivelDetectabilidadDesarrollo?: string
    tipoTrabajoTecnico?: string
    esError?: boolean
    esRetrabajo?: boolean
    esCambioMenor?: boolean
    estaBloqueado?: boolean
    motivoRetrabajo?: string
    areasImpacto?: Array<string>
    grupoObjetivo?: string
    areaFuncional?: string
    resultadoProbable?: string
    senialesDesperdicio?: Array<string>
    senialesProceso?: Array<string>
    confianza?: number
    createdAt?: Date
    updatedAt?: Date
}

interface IRedmineIssueAnalysis {
    _id: string
    redmineIssue: any
    issue?: IRedmineIssueBase | IRedmineIssue
    resumen?: string
    categoria?: string
    tipoObjetivo?: string
    nivelValor?: string
    nivelComplejidad?: string
    nivelUrgencia?: string
    nivelDetectabilidadDesarrollo?: string
    tipoTrabajoTecnico?: string
    esError?: boolean
    esRetrabajo?: boolean
    esCambioMenor?: boolean
    estaBloqueado?: boolean
    motivoRetrabajo?: string
    areasImpacto?: Array<string>
    grupoObjetivo?: string
    areaFuncional?: string
    resultadoProbable?: string
    senialesDesperdicio?: Array<string>
    senialesProceso?: Array<string>
    confianza?: number
    createdAt?: Date
    updatedAt?: Date
}

export type {
IRedmineIssueAnalysisBase, 
IRedmineIssueAnalysis
}
