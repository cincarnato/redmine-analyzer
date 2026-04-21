
import RedmineIssueAnalysisCrudRoute from "./RedmineIssueAnalysisCrudRoute"
import RedmineIssueAnalysisRunRoute from "./RedmineIssueAnalysisRunRoute"
import RedmineIssueDashboardRoute from "./RedmineIssueDashboardRoute"
import RedmineIssueCrudRoute from "./RedmineIssueCrudRoute"
import RedmineProjectCrudRoute from "./RedmineProjectCrudRoute"
import RedmineIssueSyncRoute from "./RedmineIssueSyncRoute"
import RedmineIssueAssistRoute from "./RedmineIssueAssistRoute"

export const routes = [
    ...RedmineIssueAnalysisCrudRoute,
    ...RedmineIssueAnalysisRunRoute,
    ...RedmineIssueAssistRoute,
    ...RedmineIssueDashboardRoute,
    ...RedmineIssueCrudRoute,
    ...RedmineProjectCrudRoute,
    ...RedmineIssueSyncRoute
]

export default routes
