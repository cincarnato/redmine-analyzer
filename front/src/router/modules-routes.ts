import baseRoutes from '../modules/base/routes/index.js'
import googleRoutes from '../modules/google/routes/index.js'
import redmineRoutes from '../modules/redmine/routes/index.js'

const modulesRoutes = [
  ...baseRoutes,
  ...googleRoutes,
  ...redmineRoutes

]

export default modulesRoutes
export {modulesRoutes}
