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
      createCard({
        title: "Distribucion por tracker",
        type: "groupBy",
        groupBy: {
          fields: ["issue.tracker.name","categoria","tipoObjetivo"],
          render: "table",
        },
      }),
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
          fields: ["tipoObjetivo"],
          render: "table",
        },
      }),
      createCard({
        title: "Valor de negocio percibido",
        type: "groupBy",
        groupBy: {
          fields: ["nivelValor"],
          render: "table",
        },
      }),
      createCard({
        title: "Nivel de complejidad",
        type: "groupBy",
        groupBy: {
          fields: ["nivelComplejidad"],
          render: "table",
        },
      }),
      createCard({
        title: "Nivel de urgencia",
        type: "groupBy",
        groupBy: {
          fields: ["nivelUrgencia"],
          render: "table",
        },
      }),
      createCard({
        title: "Resultado probable",
        type: "groupBy",
        groupBy: {
          fields: ["resultadoProbable"],
          render: "table",
        },
      }),
      createCard({
        title: "Tickets clasificados como error",
        type: "groupBy",
        groupBy: {
          fields: ["esError"],
          render: "table",
        },
      }),
      createCard({
        title: "Retrabajo detectado",
        type: "groupBy",
        groupBy: {
          fields: ["esRetrabajo"],
          render: "table",
        },
      }),
      createCard({
        title: "Cambios menores",
        type: "groupBy",
        groupBy: {
          fields: ["esCambioMenor"],
          render: "table",
        },
      }),
      createCard({
        title: "Tickets bloqueados",
        type: "groupBy",
        groupBy: {
          fields: ["estaBloqueado"],
          render: "table",
        },
      }),
      createCard({
        title: "Motivos de retrabajo",
        type: "groupBy",
        filters: [
          {
            field: "esRetrabajo",
            operator: "eq",
            value: true,
          },
        ],
        groupBy: {
          fields: ["motivoRetrabajo"],
          render: "table",
        },
      }),
      createCard({
        title: "Areas de impacto",
        type: "groupBy",
        groupBy: {
          fields: ["areasImpacto"],
          render: "table",
        },
      }),
      createCard({
        title: "Seniales de desperdicio",
        type: "groupBy",
        groupBy: {
          fields: ["senialesDesperdicio"],
          render: "table",
        },
      }),
      createCard({
        title: "Seniales del proceso",
        type: "groupBy",
        groupBy: {
          fields: ["senialesProceso"],
          render: "table",
        },
      }),

      // createCard({
      //   title: "Analisis recientes",
      //   type: "paginate",
      //   layout: {
      //     cols: 12,
      //     sm: 12,
      //     md: 12,
      //     lg: 12,
      //     height: 420,
      //     cardVariant: "outlined",
      //   },
      //   paginate: {
      //     columns: [
      //       "issue.redmineId",
      //       "categoria",
      //       "tipoObjetivo",
      //       "nivelValor",
      //       "nivelUrgencia",
      //       "esError",
      //       "esRetrabajo",
      //       "estaBloqueado",
      //       "resultadoProbable",
      //       "confianza",
      //       "updatedAt",
      //     ],
      //     orderBy: "updatedAt",
      //     order: "desc",
      //   },
      // }),

      createCard({
        title: "Vision General Analisis",
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
          fields: ["categoria", "tipoObjetivo", "nivelValor", "resultadoProbable", "nivelComplejidad", "nivelUrgencia"],
          render: "table",
        },
      }),
      createCard({
        title: "Categoria por objetivo principal",
        type: "groupBy",
        layout: {
          cols: 12,
          sm: 12,
          md: 12,
          lg: 6,
          height: 420,
          cardVariant: "outlined",
        },
        groupBy: {
          fields: ["categoria", "tipoObjetivo"],
          render: "table",
        },
      }),
      createCard({
        title: "Valor por categoria y objetivo",
        type: "groupBy",
        layout: {
          cols: 12,
          sm: 12,
          md: 12,
          lg: 6,
          height: 420,
          cardVariant: "outlined",
        },
        groupBy: {
          fields: ["categoria", "tipoObjetivo", "nivelValor"],
          render: "table",
        },
      }),
      createCard({
        title: "Complejidad por categoria y urgencia",
        type: "groupBy",
        layout: {
          cols: 12,
          sm: 12,
          md: 12,
          lg: 6,
          height: 420,
          cardVariant: "outlined",
        },
        groupBy: {
          fields: ["categoria", "nivelUrgencia", "nivelComplejidad"],
          render: "table",
        },
      }),
      createCard({
        title: "Categoria por resultado probable",
        type: "groupBy",
        layout: {
          cols: 12,
          sm: 12,
          md: 12,
          lg: 6,
          height: 420,
          cardVariant: "outlined",
        },
        groupBy: {
          fields: ["categoria", "resultadoProbable"],
          render: "table",
        },
      }),
      createCard({
        title: "Retrabajo por motivo y complejidad",
        type: "groupBy",
        filters: [
          {
            field: "esRetrabajo",
            operator: "eq",
            value: true,
          },
        ],
        layout: {
          cols: 12,
          sm: 12,
          md: 12,
          lg: 6,
          height: 420,
          cardVariant: "outlined",
        },
        groupBy: {
          fields: ["motivoRetrabajo", "nivelComplejidad"],
          render: "table",
        },
      }),
    ],
  };
}

export {createRedmineIssueDashboard};
export default createRedmineIssueDashboard;
