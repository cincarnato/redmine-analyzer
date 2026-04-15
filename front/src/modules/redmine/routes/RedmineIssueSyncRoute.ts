import RedmineIssueSyncPage from "../pages/sync/RedmineIssueSyncPage.vue";

const RedmineIssueSyncRoute = [
  {
    name: 'RedmineIssueSyncPage',
    path: '/redmine/sync',
    component: RedmineIssueSyncPage,
    meta: {
      auth: true,
      permission: 'redmineissue:manage',
    }
  },
]

export default RedmineIssueSyncRoute
export { RedmineIssueSyncRoute }
