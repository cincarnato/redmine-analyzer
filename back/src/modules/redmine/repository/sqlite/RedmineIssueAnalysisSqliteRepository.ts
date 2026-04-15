
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {IRedmineIssueAnalysisRepository} from '../../interfaces/IRedmineIssueAnalysisRepository'
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from "../../interfaces/IRedmineIssueAnalysis";
import {SqliteTableField} from "@drax/common-back";

class RedmineIssueAnalysisSqliteRepository extends AbstractSqliteRepository<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase> implements IRedmineIssueAnalysisRepository {

    protected db: any;
    protected tableName: string = 'RedmineIssueAnalysis';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['resumen', 'grupoObjetivo', 'areaFuncional'];
    protected booleanFields: string[] = ['esError', 'esRetrabajo', 'esCambioMenor', 'estaBloqueado'];
    protected jsonFields: string[] = ['redmineIssueSnapshot', 'areasImpacto', 'senialesDesperdicio', 'senialesProceso'];
    protected identifier: string = '_id';
    protected populateFields = [
        { field: 'redmineIssue', table: 'redmineIssue', identifier: '_id' }
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "redmineIssue", type: "TEXT", unique: undefined, primary: false},
{name: "redmineIssueSnapshot", type: "TEXT", unique: undefined, primary: false},
{name: "resumen", type: "TEXT", unique: undefined, primary: false},
{name: "categoria", type: "TEXT", unique: undefined, primary: false},
{name: "tipoObjetivo", type: "TEXT", unique: undefined, primary: false},
{name: "nivelValor", type: "TEXT", unique: undefined, primary: false},
{name: "nivelComplejidad", type: "TEXT", unique: undefined, primary: false},
{name: "nivelUrgencia", type: "TEXT", unique: undefined, primary: false},
{name: "esError", type: "TEXT", unique: undefined, primary: false},
{name: "esRetrabajo", type: "TEXT", unique: undefined, primary: false},
{name: "esCambioMenor", type: "TEXT", unique: undefined, primary: false},
{name: "estaBloqueado", type: "TEXT", unique: undefined, primary: false},
{name: "motivoRetrabajo", type: "TEXT", unique: undefined, primary: false},
{name: "areasImpacto", type: "TEXT", unique: undefined, primary: false},
{name: "grupoObjetivo", type: "TEXT", unique: undefined, primary: false},
{name: "areaFuncional", type: "TEXT", unique: undefined, primary: false},
{name: "resultadoProbable", type: "TEXT", unique: undefined, primary: false},
{name: "senialesDesperdicio", type: "TEXT", unique: undefined, primary: false},
{name: "senialesProceso", type: "TEXT", unique: undefined, primary: false},
{name: "confianza", type: "REAL", unique: undefined, primary: false}
    ]
  
}

export default RedmineIssueAnalysisSqliteRepository
export {RedmineIssueAnalysisSqliteRepository}
