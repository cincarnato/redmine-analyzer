import RedmineIssueAnalysisRunPage from "../pages/analysis/RedmineIssueAnalysisRunPage.vue";

const RedmineIssueAnalysisRunRoute = [
  {
    name: 'RedmineIssueAnalysisRunPage',
    path: '/redmine/analyze',
    component: RedmineIssueAnalysisRunPage,
    meta: {
      auth: true,
      permission: 'redmineissueanalysis:manage',
    }
  },
]

export default RedmineIssueAnalysisRunRoute
export { RedmineIssueAnalysisRunRoute }
