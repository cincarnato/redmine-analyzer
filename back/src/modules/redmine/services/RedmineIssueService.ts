
import type{IRedmineIssueRepository} from "../interfaces/IRedmineIssueRepository";
import type {IRedmineIssueBase, IRedmineIssue} from "../interfaces/IRedmineIssue";
import {AbstractService} from "@drax/crud-back";
import type {ZodObject, ZodRawShape} from "zod";

class RedmineIssueService extends AbstractService<IRedmineIssue, IRedmineIssueBase, IRedmineIssueBase> {


    constructor(RedmineIssueRepository: IRedmineIssueRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(RedmineIssueRepository, baseSchema, fullSchema);
        
        this._validateOutput = true
        
    }

}

export default RedmineIssueService
export {RedmineIssueService}
