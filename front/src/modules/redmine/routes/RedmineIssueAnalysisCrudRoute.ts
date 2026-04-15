
import RedmineIssueAnalysisCrudPage from "../pages/crud/RedmineIssueAnalysisCrudPage.vue";


const RedmineIssueAnalysisCrudRoute = [
  {
    name: 'RedmineIssueAnalysisCrudPage',
    path: '/crud/redmineissueanalysis',
    component: RedmineIssueAnalysisCrudPage,
    meta: {
      auth: true,
      permission: 'redmineissueanalysis:manage',
    }
  },
]

export default RedmineIssueAnalysisCrudRoute
export { RedmineIssueAnalysisCrudRoute }
