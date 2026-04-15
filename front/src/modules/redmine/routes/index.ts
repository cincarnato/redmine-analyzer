
import RedmineIssueAnalysisCrudRoute from "./RedmineIssueAnalysisCrudRoute"
import RedmineIssueAnalysisRunRoute from "./RedmineIssueAnalysisRunRoute"
import RedmineIssueDashboardRoute from "./RedmineIssueDashboardRoute"
import RedmineIssueCrudRoute from "./RedmineIssueCrudRoute"
import RedmineIssueSyncRoute from "./RedmineIssueSyncRoute"

export const routes = [
    ...RedmineIssueAnalysisCrudRoute,
    ...RedmineIssueAnalysisRunRoute,
    ...RedmineIssueDashboardRoute,
    ...RedmineIssueCrudRoute,
    ...RedmineIssueSyncRoute
]

export default routes
