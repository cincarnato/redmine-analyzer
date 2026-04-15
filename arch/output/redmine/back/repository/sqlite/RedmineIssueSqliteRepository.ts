
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {IRedmineIssueRepository} from '../../interfaces/IRedmineIssueRepository'
import type {IRedmineIssue, IRedmineIssueBase} from "../../interfaces/IRedmineIssue";
import {SqliteTableField} from "@drax/common-back";

class RedmineIssueSqliteRepository extends AbstractSqliteRepository<IRedmineIssue, IRedmineIssueBase, IRedmineIssueBase> implements IRedmineIssueRepository {

    protected db: any;
    protected tableName: string = 'RedmineIssue';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['redmineId', 'subject', 'description'];
    protected booleanFields: string[] = ['isPrivate'];
    protected jsonFields: string[] = ['project', 'tracker', 'status', 'priority', 'author', 'customFields', 'rawPayload'];
    protected identifier: string = 'redmineId';
    protected populateFields = [
        
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "redmineId", type: "FLOAT", unique: true, primary: false},
{name: "redmineId", type: "TEXT", unique: true, primary: false},
{name: "subject", type: "TEXT", unique: undefined, primary: false},
{name: "description", type: "TEXT", unique: undefined, primary: false},
{name: "doneRatio", type: "FLOAT", unique: undefined, primary: false},
{name: "doneRatio", type: "TEXT", unique: undefined, primary: false},
{name: "isPrivate", type: "TEXT", unique: undefined, primary: false},
{name: "spentHours", type: "FLOAT", unique: undefined, primary: false},
{name: "spentHours", type: "TEXT", unique: undefined, primary: false},
{name: "totalSpentHours", type: "FLOAT", unique: undefined, primary: false},
{name: "totalSpentHours", type: "TEXT", unique: undefined, primary: false},
{name: "estimatedHours", type: "FLOAT", unique: undefined, primary: false},
{name: "estimatedHours", type: "TEXT", unique: undefined, primary: false},
{name: "totalEstimatedHours", type: "FLOAT", unique: undefined, primary: false},
{name: "totalEstimatedHours", type: "TEXT", unique: undefined, primary: false},
{name: "startDate", type: "TEXT", unique: undefined, primary: false},
{name: "dueDate", type: "TEXT", unique: undefined, primary: false},
{name: "createdOn", type: "TEXT", unique: undefined, primary: false},
{name: "updatedOn", type: "TEXT", unique: undefined, primary: false},
{name: "closedOn", type: "TEXT", unique: undefined, primary: false},
{name: "project", type: "TEXT", unique: undefined, primary: false},
{name: "tracker", type: "TEXT", unique: undefined, primary: false},
{name: "status", type: "TEXT", unique: undefined, primary: false},
{name: "priority", type: "TEXT", unique: undefined, primary: false},
{name: "author", type: "TEXT", unique: undefined, primary: false},
{name: "customFields", type: "TEXT", unique: undefined, primary: false},
{name: "syncSource", type: "TEXT", unique: undefined, primary: false},
{name: "rawPayload", type: "TEXT", unique: undefined, primary: false}
    ]
  
}

export default RedmineIssueSqliteRepository
export {RedmineIssueSqliteRepository}

