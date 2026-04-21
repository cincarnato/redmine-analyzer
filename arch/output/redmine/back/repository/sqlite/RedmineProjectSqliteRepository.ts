
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {IRedmineProjectRepository} from '../../interfaces/IRedmineProjectRepository'
import type {IRedmineProject, IRedmineProjectBase} from "../../interfaces/IRedmineProject";
import {SqliteTableField} from "@drax/common-back";

class RedmineProjectSqliteRepository extends AbstractSqliteRepository<IRedmineProject, IRedmineProjectBase, IRedmineProjectBase> implements IRedmineProjectRepository {

    protected db: any;
    protected tableName: string = 'RedmineProject';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['redmineId', 'name'];
    protected booleanFields: string[] = [];
    protected jsonFields: string[] = ['goals'];
    protected identifier: string = 'redmineId';
    protected populateFields = [
        
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "redmineId", type: "REAL", unique: true, primary: false},
{name: "name", type: "TEXT", unique: undefined, primary: false},
{name: "goals", type: "TEXT", unique: undefined, primary: false}
    ]
  
}

export default RedmineProjectSqliteRepository
export {RedmineProjectSqliteRepository}
