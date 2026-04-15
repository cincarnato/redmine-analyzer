
import RedmineIssueServiceFactory from "../factory/services/RedmineIssueServiceFactory.js";
import {AbstractFastifyController} from "@drax/crud-back";
import RedmineIssuePermissions from "../permissions/RedmineIssuePermissions.js";
import type {IRedmineIssue, IRedmineIssueBase} from "../interfaces/IRedmineIssue";

class RedmineIssueController extends AbstractFastifyController<IRedmineIssue, IRedmineIssueBase, IRedmineIssueBase>   {

    constructor() {
        super(RedmineIssueServiceFactory.instance, RedmineIssuePermissions)
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

export default RedmineIssueController;
export {
    RedmineIssueController
}

