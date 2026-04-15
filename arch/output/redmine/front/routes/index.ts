
import RedmineIssueCrudRoute from "./RedmineIssueCrudRoute"
import RedmineIssueAnalysisCrudRoute from "./RedmineIssueAnalysisCrudRoute"

export const routes = [
    ...RedmineIssueCrudRoute,
...RedmineIssueAnalysisCrudRoute
]

export default routes
