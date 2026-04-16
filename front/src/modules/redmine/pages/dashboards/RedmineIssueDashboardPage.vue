<script setup lang="ts">
import type {IDashboardBase} from "@drax/dashboard-share";
import {DashboardView} from "@drax/dashboard-vue";
import {onMounted, ref, watch} from "vue";
import {VDateInput} from "vuetify/labs/VDateInput";
import {createRedmineIssueDashboard} from "../../dashboards/RedmineIssueDashboard";
import type {IRedmineProjectOption} from "../../interfaces/IRedmineSync";
import RedmineIssueProvider from "../../providers/RedmineIssueProvider";

type DashboardFilter = NonNullable<IDashboardBase["cards"]>[number]["filters"][number];
type DateRangeFilter = {
  field: string;
  operator: string;
  value: Date | null;
};

const provider = RedmineIssueProvider.instance;
const today = new Date();
today.setHours(23, 59, 59, 999);

const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
firstDayOfCurrentMonth.setHours(0, 0, 0, 0);

const dashboard = ref<IDashboardBase>(createRedmineIssueDashboard());
const baseCardFilters = (dashboard.value.cards ?? []).map((card) => [...(card.filters ?? [])]);
const loadingProjects = ref(false);
const projects = ref<IRedmineProjectOption[]>([]);
const selectedProjectIds = ref<Array<number | string>>([]);

const filters = ref<DateRangeFilter[]>([
  {field: "closedOn", operator: "gte", value: firstDayOfCurrentMonth},
  {field: "closedOn", operator: "lte", value: new Date(today)},
]);

async function loadProjects(): Promise<void> {
  loadingProjects.value = true;

  try {
    projects.value = await provider.fetchProjects();
  } catch (error) {
    console.error("Error loading Redmine projects:", error);
  } finally {
    loadingProjects.value = false;
  }
}

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

function applyFilters(): void {
  (dashboard.value.cards ?? []).forEach((card, index) => {
    const activeFilters: DashboardFilter[] = [];
    const from = normalizeStartDate(filters.value[0]?.value);
    const to = normalizeEndDate(filters.value[1]?.value);

    if (from) {
      activeFilters.push({field: "closedOn", operator: "gte", value: from.toISOString()});
    }

    if (to) {
      activeFilters.push({field: "closedOn", operator: "lte", value: to.toISOString()});
    }

    if (selectedProjectIds.value.length > 0) {
      activeFilters.push({
        field: "project.id",
        operator: "in",
        value: selectedProjectIds.value,
      });
    }

    card.filters = [...activeFilters, ...baseCardFilters[index]];
  });
}

watch([filters, selectedProjectIds], applyFilters, {deep: true, immediate: true});

onMounted(async () => {
  await loadProjects();
});
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-combobox
          v-model="selectedProjectIds"
          :items="projects"
          item-title="name"
          item-value="id"
          :return-object="false"
          label="Proyectos"
          :loading="loadingProjects"
          :disabled="loadingProjects"
          multiple
          chips
          closable-chips
          clearable
        />
      </v-col>
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
