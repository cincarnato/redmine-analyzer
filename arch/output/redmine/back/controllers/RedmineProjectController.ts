
import RedmineProjectServiceFactory from "../factory/services/RedmineProjectServiceFactory.js";
import {AbstractFastifyController} from "@drax/crud-back";
import RedmineProjectPermissions from "../permissions/RedmineProjectPermissions.js";
import type {IRedmineProject, IRedmineProjectBase} from "../interfaces/IRedmineProject";

class RedmineProjectController extends AbstractFastifyController<IRedmineProject, IRedmineProjectBase, IRedmineProjectBase>   {

    constructor() {
        super(RedmineProjectServiceFactory.instance, RedmineProjectPermissions)
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

export default RedmineProjectController;
export {
    RedmineProjectController
}

