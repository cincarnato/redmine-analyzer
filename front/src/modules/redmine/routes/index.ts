
import RedmineIssueAnalysisCrudRoute from "./RedmineIssueAnalysisCrudRoute"
import RedmineIssueAnalysisRunRoute from "./RedmineIssueAnalysisRunRoute"
import RedmineIssueCrudRoute from "./RedmineIssueCrudRoute"
import RedmineIssueSyncRoute from "./RedmineIssueSyncRoute"

export const routes = [
    ...RedmineIssueAnalysisCrudRoute,
    ...RedmineIssueAnalysisRunRoute,
    ...RedmineIssueCrudRoute,
    ...RedmineIssueSyncRoute
]

export default routes
