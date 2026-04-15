
import RedmineIssueCrudPage from "../pages/crud/RedmineIssueCrudPage.vue";


const RedmineIssueCrudRoute = [
  {
    name: 'RedmineIssueCrudPage',
    path: '/crud/redmineissue',
    component: RedmineIssueCrudPage,
    meta: {
      auth: true,
      permission: 'redmineissue:manage',
    }
  },
]

export default RedmineIssueCrudRoute
export { RedmineIssueCrudRoute }
