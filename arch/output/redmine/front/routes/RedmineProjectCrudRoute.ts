
import RedmineProjectCrudPage from "../pages/crud/RedmineProjectCrudPage.vue";


const RedmineProjectCrudRoute = [
  {
    name: 'RedmineProjectCrudPage',
    path: '/crud/redmineproject',
    component: RedmineProjectCrudPage,
    meta: {
      auth: true,
      permission: 'redmineproject:manage',
    }
  },
]

export default RedmineProjectCrudRoute
export { RedmineProjectCrudRoute }
