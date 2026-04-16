import type {IDashboardBase, IDashboardCard} from "@drax/dashboard-share";
import RedmineIssueAnalysisCrud from "../cruds/RedmineIssueAnalysisCrud";

function createCard(card: Partial<IDashboardCard> & Pick<IDashboardCard, "title" | "type">): IDashboardCard {
  return {
    entity: "RedmineIssueAnalysis",
    entityInstance: RedmineIssueAnalysisCrud.instance,
    filters: [],
    layout: {
      cols: 12,
      sm: 12,
      md: 6,
      lg: 4,
      height: 360,
      cardVariant: "outlined",
    },
    ...card,
  } as IDashboardCard;
}

function createRedmineIssueDashboard(): IDashboardBase {
  return {
    identifier: "redmine-issue-analysis",
    title: "Redmine Issue Analysis Dashboard",
    cards: [


      createCard({
        title: "Distribucion por categoria",
        type: "groupBy",
        groupBy: {
          fields: ["categoria"],
          render: "table",
        },
      }),
      createCard({
        title: "Objetivo principal",
        type: "groupBy",
        groupBy: {
          fields: ["objetivo"],
          render: "table",
        },
      }),
      createCard({
        title: "Valor de negocio percibido",
        type: "groupBy",
        groupBy: {
          fields: ["valorNegocio"],
          render: "table",
        },
      }),

      createCard({
        title: "Objetivo por categoria y valor",
        type: "groupBy",
        layout: {
          cols: 12,
          sm: 12,
          md: 12,
          lg: 12,
          height: 420,
          cardVariant: "outlined",
        },
        groupBy: {
          fields: ["objetivo", "categoria",  "valorNegocio"],
          render: "table",
        },
      }),

      createCard({
        title: "Tipo de error",
        type: "groupBy",
        filters: [{field: 'categoria', operator: 'eq', value: 'error'}],
        groupBy: {
          fields: ["tipoError"],
          render: "table",
        },
      }),
      createCard({
        title: "Causa Error",
        type: "groupBy",
        filters: [{field: 'categoria', operator: 'eq', value: 'error'}],
        groupBy: {
          fields: ["causaError"],
          render: "table",
        },
      }),
      createCard({
        title: "Severidad Error",
        type: "groupBy",
        filters: [{field: 'categoria', operator: 'eq', value: 'error'}],
        groupBy: {
          fields: ["severidadError"],
          render: "table",
        },
      }),

      createCard({
        title: "Errores",
        type: "groupBy",
        layout: {
          cols: 12,
          sm: 12,
          md: 12,
          lg: 12,
          height: 420,
          cardVariant: "outlined",
        },
        filters: [{field: 'categoria', operator: 'eq', value: 'error'}],
        groupBy: {
          fields: ["tipoError", "causaError",  "severidadError"],
          render: "table",
        },
      }),

      // createCard({
      //   title: "Nivel de complejidad",
      //   type: "groupBy",
      //   groupBy: {
      //     fields: ["complejidad"],
      //     render: "table",
      //   },
      // }),
      // createCard({
      //   title: "Nivel de urgencia",
      //   type: "groupBy",
      //   groupBy: {
      //     fields: ["nivelUrgencia"],
      //     render: "table",
      //   },
      // }),

      // createCard({
      //   title: "Categoria por objetivo principal",
      //   type: "groupBy",
      //   layout: {
      //     cols: 12,
      //     sm: 12,
      //     md: 12,
      //     lg: 6,
      //     height: 420,
      //     cardVariant: "outlined",
      //   },
      //   groupBy: {
      //     fields: ["categoria", "objetivo"],
      //     render: "table",
      //   },
      // }),

      createCard({
        title: "Distribucion por Sprint",
        type: "groupBy",
        groupBy: {
          fields: ["issue.fixedVersion.name"],
          render: "table",
        },
      }),
      createCard({
        title: "Distribucion por tracker",
        type: "groupBy",
        groupBy: {
          fields: ["issue.tracker.name"],
          render: "table",
        },
      }),
      createCard({
        title: "Distribucion por Autor",
        type: "groupBy",
        groupBy: {
          fields: ["issue.author.name"],
          render: "table",
        },
      }),
    ],
  };
}

export {createRedmineIssueDashboard};
export default createRedmineIssueDashboard;
