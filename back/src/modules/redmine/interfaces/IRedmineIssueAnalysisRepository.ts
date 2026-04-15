
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from './IRedmineIssueAnalysis'
import {IDraxCrudRepository} from "@drax/crud-share";

interface IRedmineIssueAnalysisRepository extends IDraxCrudRepository<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase>{

}

export {IRedmineIssueAnalysisRepository}


