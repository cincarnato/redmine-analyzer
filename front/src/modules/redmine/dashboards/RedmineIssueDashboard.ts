import type {IDashboardBase, IDashboardCard} from "@drax/dashboard-share";
import RedmineIssueCrud from "../cruds/RedmineIssueCrud";

function createCard(card: Partial<IDashboardCard> & Pick<IDashboardCard, "title" | "type">): IDashboardCard {
  return {
    entity: "RedmineIssue",
    entityInstance: RedmineIssueCrud.instance,
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
    identifier: "redmine-issue",
    title: "Redmine Issue Dashboard",
    cards: [
    createCard({
      title: "Distribucion por Sprint",
      type: "groupBy",
      groupBy: {
        fields: ["fixedVersion.name"],
        render: "table",
      },
    }),
      createCard({
        title: "Distribucion por tracker",
        type: "groupBy",
        groupBy: {
          fields: ["tracker.name"],
          render: "table",
        },
      }),
      createCard({
        title: "Distribucion por Autor",
        type: "groupBy",
        groupBy: {
          fields: ["author.name"],
          render: "table",
        },
      }),
      createCard({
        title: "Distribucion sprint ",
        type: "groupBy",
        layout: {
          cols: 6,
          sm: 6,
          md: 6,
          lg: 6,
          height: 420,
          cardVariant: "outlined",
        },
        groupBy: {
          fields: ["fixedVersion.name","tracker.name"],
          render: "table",
        },
      }),

      createCard({
        title: "Distribucion Autor ",
        type: "groupBy",
        layout: {
          cols: 6,
          sm: 6,
          md: 6,
          lg: 6,
          height: 420,
          cardVariant: "outlined",
        },
        groupBy: {
          fields: ["author.name","tracker.name"],
          render: "table",
        },
      }),
    ],
  };
}

export {createRedmineIssueDashboard};
export default createRedmineIssueDashboard;
