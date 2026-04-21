
import type{IRedmineProjectRepository} from "../interfaces/IRedmineProjectRepository";
import type {IRedmineProjectBase, IRedmineProject} from "../interfaces/IRedmineProject";
import {AbstractService} from "@drax/crud-back";
import type {ZodObject, ZodRawShape} from "zod";

class RedmineProjectService extends AbstractService<IRedmineProject, IRedmineProjectBase, IRedmineProjectBase> {


    constructor(RedmineProjectRepository: IRedmineProjectRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(RedmineProjectRepository, baseSchema, fullSchema);
        
        this._validateOutput = true
        
    }

}

export default RedmineProjectService
export {RedmineProjectService}
