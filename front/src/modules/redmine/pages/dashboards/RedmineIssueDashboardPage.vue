<script setup lang="ts">
import type {IDashboardBase} from "@drax/dashboard-share";
import {DashboardView} from "@drax/dashboard-vue";
import {ref, watch} from "vue";
import {VDateInput} from "vuetify/labs/VDateInput";
import {createRedmineIssueDashboard} from "../../dashboards/RedmineIssueDashboard";

type DashboardFilter = NonNullable<IDashboardBase["cards"]>[number]["filters"][number];
type DateRangeFilter = {
  field: string;
  operator: string;
  value: Date | null;
};

const today = new Date();
today.setHours(23, 59, 59, 999);

const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
firstDayOfCurrentMonth.setHours(0, 0, 0, 0);

const dashboard = ref<IDashboardBase>(createRedmineIssueDashboard());
const baseCardFilters = (dashboard.value.cards ?? []).map((card) => [...(card.filters ?? [])]);

const filters = ref<DateRangeFilter[]>([
  {field: "closedOn", operator: "gte", value: firstDayOfCurrentMonth},
  {field: "closedOn", operator: "lte", value: new Date(today)},
]);

function normalizeStartDate(value: unknown): Date | null {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return null;
  }

  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function normalizeEndDate(value: unknown): Date | null {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return null;
  }

  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
}

function applyDateFilters(): void {
  (dashboard.value.cards ?? []).forEach((card, index) => {
    const dateFilters: DashboardFilter[] = [];
    const from = normalizeStartDate(filters.value[0]?.value);
    const to = normalizeEndDate(filters.value[1]?.value);

    if (from) {
      dateFilters.push({field: "closedOn", operator: "gte", value: from.toISOString()});
    }

    if (to) {
      dateFilters.push({field: "closedOn", operator: "lte", value: to.toISOString()});
    }

    card.filters = [...dateFilters, ...baseCardFilters[index]];
  });
}

watch(filters, applyDateFilters, {deep: true, immediate: true});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-date-input
          v-model="filters[0].value"
          label="Desde"
          prepend-icon=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-date-input
          v-model="filters[1].value"
          label="Hasta"
          prepend-icon=""
        />
      </v-col>
    </v-row>

    <DashboardView :dashboard="dashboard" />
  </v-container>
</template>
