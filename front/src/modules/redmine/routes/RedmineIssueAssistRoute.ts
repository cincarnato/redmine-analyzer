import RedmineIssueAssistPage from '../pages/assist/RedmineIssueAssistPage.vue'

const RedmineIssueAssistRoute = [
  {
    name: 'RedmineIssueAssistPage',
    path: '/redmine/assist',
    component: RedmineIssueAssistPage,
    meta: {
      auth: true,
      permission: 'redmineissueanalysis:manage',
    }
  },
]

export default RedmineIssueAssistRoute
export { RedmineIssueAssistRoute }
