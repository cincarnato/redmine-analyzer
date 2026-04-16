import RedmineIssueAnalysisDashboardPage from "../pages/dashboards/RedmineIssueAnalysisDashboardPage.vue";
import RedmineIssueAnalysisMonthlyDashboardPage from "../pages/dashboards/RedmineIssueAnalysisMonthlyDashboardPage.vue";
import RedmineIssueDashboardPage from "../pages/dashboards/RedmineIssueDashboardPage.vue";

const RedmineIssueDashboardRoute = [
  {
    name: "RedmineIssueAnalysisDashboardPage",
    path: "/redmine/dashboard/analysis",
    component: RedmineIssueAnalysisDashboardPage,
    meta: {
      auth: true,
      permission: "redmineissueanalysis:manage",
    },
  },
  {
    name: "RedmineIssueAnalysisMonthlyDashboardPage",
    path: "/redmine/dashboard/analysis/monthly",
    component: RedmineIssueAnalysisMonthlyDashboardPage,
    meta: {
      auth: true,
      permission: "redmineissueanalysis:manage",
    },
  },
  {
    name: "RedmineIssueDashboardPage",
    path: "/redmine/dashboard/issues",
    component: RedmineIssueDashboardPage,
    meta: {
      auth: true,
      permission: "redmineissue:manage",
    },
  },
];

export default RedmineIssueDashboardRoute;
export {RedmineIssueDashboardRoute};
