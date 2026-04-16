
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {IRedmineIssueAnalysisRepository} from '../../interfaces/IRedmineIssueAnalysisRepository'
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from "../../interfaces/IRedmineIssueAnalysis";
import {SqliteTableField} from "@drax/common-back";

class RedmineIssueAnalysisSqliteRepository extends AbstractSqliteRepository<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase> implements IRedmineIssueAnalysisRepository {

    protected db: any;
    protected tableName: string = 'RedmineIssueAnalysis';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['resumen', 'rolObjetivo', 'areaFuncional'];
    protected jsonFields: string[] = ['issue', 'seniales'];
    protected identifier: string = '_id';
    protected populateFields = [
        { field: 'redmineIssue', table: 'redmineIssue', identifier: '_id' }
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "redmineIssue", type: "TEXT", unique: undefined, primary: false},
{name: "issue", type: "TEXT", unique: undefined, primary: false},
{name: "resumen", type: "TEXT", unique: undefined, primary: false},
{name: "categoria", type: "TEXT", unique: undefined, primary: false},
{name: "causaError", type: "TEXT", unique: undefined, primary: false},
{name: "severidadError", type: "TEXT", unique: undefined, primary: false},
{name: "tipoError", type: "TEXT", unique: undefined, primary: false},
{name: "objetivo", type: "TEXT", unique: undefined, primary: false},
{name: "valorNegocio", type: "TEXT", unique: undefined, primary: false},
{name: "complejidad", type: "TEXT", unique: undefined, primary: false},
{name: "nivelUrgencia", type: "TEXT", unique: undefined, primary: false},
{name: "rolObjetivo", type: "TEXT", unique: undefined, primary: false},
{name: "areaFuncional", type: "TEXT", unique: undefined, primary: false},
{name: "seniales", type: "TEXT", unique: undefined, primary: false}
    ]
  
}

export default RedmineIssueAnalysisSqliteRepository
export {RedmineIssueAnalysisSqliteRepository}
