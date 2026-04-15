
import RedmineIssueAnalysisServiceFactory from "../factory/services/RedmineIssueAnalysisServiceFactory.js";
import {AbstractFastifyController} from "@drax/crud-back";
import RedmineIssueAnalysisPermissions from "../permissions/RedmineIssueAnalysisPermissions.js";
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from "../interfaces/IRedmineIssueAnalysis";

class RedmineIssueAnalysisController extends AbstractFastifyController<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase>   {

    constructor() {
        super(RedmineIssueAnalysisServiceFactory.instance, RedmineIssueAnalysisPermissions)
        this.tenantField = "tenant";
        this.userField = "user";
        
        this.tenantFilter = false;
        this.tenantSetter = false;
        this.tenantAssert = false;
        
        this.userFilter = false;
        this.userSetter = false;
        this.userAssert = false;
    }

}

export default RedmineIssueAnalysisController;
export {
    RedmineIssueAnalysisController
}

