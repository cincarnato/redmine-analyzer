
import type {IRedmineIssue, IRedmineIssueBase} from './IRedmineIssue'
import {IDraxCrudRepository} from "@drax/crud-share";

interface IRedmineIssueRepository extends IDraxCrudRepository<IRedmineIssue, IRedmineIssueBase, IRedmineIssueBase>{

}

export {IRedmineIssueRepository}


