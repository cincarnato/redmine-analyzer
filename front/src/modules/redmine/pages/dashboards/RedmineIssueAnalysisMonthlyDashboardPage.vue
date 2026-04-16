<script setup lang="ts">
import type {IDashboardBase} from "@drax/dashboard-share";
import {DashboardView} from "@drax/dashboard-vue";
import {computed} from "vue";
import {createRedmineIssueDashboard} from "../../dashboards/RedmineIssueAnalysisMonthlyDashboard";

type DashboardCard = NonNullable<IDashboardBase["cards"]>[number];
type DashboardFilter = NonNullable<DashboardCard["filters"]>[number];

type MonthRange = {
  key: string;
  label: string;
  from: Date;
  to: Date;
};

const MONTHS_TO_SHOW = 6;

function cloneCard(card: DashboardCard): DashboardCard {
  return {
    ...card,
    filters: [...(card.filters ?? [])],
    layout: card.layout ? {...card.layout} : undefined,
    groupBy: card.groupBy ? {...card.groupBy, fields: [...(card.groupBy.fields ?? [])]} : undefined,
  };
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function createRecentMonthRanges(monthCount: number): MonthRange[] {
  const currentDate = new Date();
  const months: MonthRange[] = [];

  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - offset, 1);
    const from = getMonthStart(monthDate);
    const to = getMonthEnd(monthDate);

    months.push({
      key: `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}`,
      label: from.toLocaleDateString("es-AR", {month: "short", year: "numeric"}),
      from,
      to,
    });
  }

  return months;
}

function createMonthlyFilters(month: MonthRange): DashboardFilter[] {
  return [
    {field: "issue.closedOn", operator: "gte", value: month.from.toISOString()},
    {field: "issue.closedOn", operator: "lte", value: month.to.toISOString()},
  ];
}

function createMonthlyLayout(card: DashboardCard): DashboardCard["layout"] {
  return {
    cols: 12,
    sm: 6,
    md: 4,
    lg: 4,
    height: card.layout?.height ?? 360,
    cardVariant: card.layout?.cardVariant ?? "outlined",
  };
}

const monthRanges = createRecentMonthRanges(MONTHS_TO_SHOW);
const baseDashboard = createRedmineIssueDashboard();

const dashboard = computed<IDashboardBase>(() => {
  const monthlyCards = (baseDashboard.cards ?? []).flatMap((baseCard) => {
    return monthRanges.map((month) => {
      const card = cloneCard(baseCard);

      return {
        ...card,
        title: `${baseCard.title} · ${month.label}`,
        filters: [...createMonthlyFilters(month), ...(card.filters ?? [])],
        layout: createMonthlyLayout(card),
      };
    });
  });

  return {
    ...baseDashboard,
    identifier: "redmine-issue-analysis-monthly",
    title: "Redmine Issue Analysis Dashboard Mensual",
    cards: monthlyCards,
  };
});
</script>

<template>
  <v-container fluid>
    <v-row class="mb-4" dense>
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-text class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="month in monthRanges"
              :key="month.key"
              color="primary"
              size="small"
              variant="tonal"
            >
              {{ month.label }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <DashboardView :dashboard="dashboard" />
  </v-container>
</template>
