
import type{IRedmineIssueAnalysisRepository} from "../interfaces/IRedmineIssueAnalysisRepository";
import type {IRedmineIssueAnalysisBase, IRedmineIssueAnalysis} from "../interfaces/IRedmineIssueAnalysis";
import {AbstractService} from "@drax/crud-back";
import type {ZodObject, ZodRawShape} from "zod";

class RedmineIssueAnalysisService extends AbstractService<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase> {


    constructor(RedmineIssueAnalysisRepository: IRedmineIssueAnalysisRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(RedmineIssueAnalysisRepository, baseSchema, fullSchema);
        
        this._validateOutput = true
        
    }

}

export default RedmineIssueAnalysisService
export {RedmineIssueAnalysisService}
