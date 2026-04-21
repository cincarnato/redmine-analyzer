
import RedmineIssueAnalysisServiceFactory from "../factory/services/RedmineIssueAnalysisServiceFactory.js";
import {AbstractFastifyController, CustomRequest} from "@drax/crud-back";
import RedmineIssueAnalysisPermissions from "../permissions/RedmineIssueAnalysisPermissions.js";
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from "../interfaces/IRedmineIssueAnalysis";
import type {FastifyReply} from "fastify";
import RedmineIssueAnalyzer from "../analyzers/RedmineIssueAnalyzer.js";
import type {IAnalyzeIssuesPayload} from "../analyzers/RedmineIssueAnalyzer.js";

class RedmineIssueAnalysisController extends AbstractFastifyController<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase>   {
    private readonly issueAnalyzer = new RedmineIssueAnalyzer();

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

    async analyzeIssues(request: CustomRequest, reply: FastifyReply) {
        try {
            request?.rbac.assertAuthenticated();
            const body = (request.body ?? {}) as IAnalyzeIssuesPayload;
            return await this.issueAnalyzer.analyzeIssues(request, body);
        } catch (e) {
            this.handleError(e, reply);
        }
    }

    async analyzeIssue(request: CustomRequest, reply: FastifyReply) {
        try {
            request?.rbac.assertAuthenticated();
            return await this.issueAnalyzer.analyzeIssue(request, request.body ?? {});
        } catch (e) {
            this.handleError(e, reply);
        }
    }

    async assistIssue(request: CustomRequest, reply: FastifyReply) {
        try {
            request?.rbac.assertAuthenticated();
            return await this.issueAnalyzer.assistIssue(request, request.body ?? {});
        } catch (e) {
            this.handleError(e, reply);
        }
    }

}

export default RedmineIssueAnalysisController;
export {
    RedmineIssueAnalysisController
}
