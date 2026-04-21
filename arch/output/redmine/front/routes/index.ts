
import RedmineIssueCrudRoute from "./RedmineIssueCrudRoute"
import RedmineIssueAnalysisCrudRoute from "./RedmineIssueAnalysisCrudRoute"
import RedmineProjectCrudRoute from "./RedmineProjectCrudRoute"

export const routes = [
    ...RedmineIssueCrudRoute,
...RedmineIssueAnalysisCrudRoute,
...RedmineProjectCrudRoute
]

export default routes
