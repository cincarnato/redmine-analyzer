<script setup lang="ts">
import {useEntityStore} from "@drax/crud-vue";
import type {IDraxFieldFilter, IEntityCrudField, IEntityCrudFieldTypes} from "@drax/crud-share";
import {computed, ref, watch} from "vue";
import {VDateInput} from "vuetify/labs/VDateInput";
import BarChart from "../../components/charts/BarChart.vue";
import LineChart from "../../components/charts/LineChart.vue";
import RedmineRemoteProjectCombobox from "../../comboboxes/RedmineRemoteProjectCombobox.vue";
import RedmineIssueAnalysisProvider from "../../providers/RedmineIssueAnalysisProvider";

type GroupableFieldOption = {
  title: string;
  value: string;
  type: IEntityCrudFieldTypes;
};

type GroupByRow = Record<string, unknown> & {
  count?: number;
};

type ChartSeries = {
  name: string;
  data: number[];
  stack?: string;
};

type FieldResult = {
  field: GroupableFieldOption;
  rows: GroupByRow[];
};

type ChartType = "bar" | "stacked-bar" | "line" | "stacked-line" | "area";

type DashboardCard = {
  id: number;
  fieldValue: string | null;
  chartType: ChartType;
  topItems: number;
  categories: string[];
  series: ChartSeries[];
  lastFieldResult: FieldResult | null;
  errorMessage: string;
};

const X_AXIS_FIELD = "issue.fixedVersion.name";
const EMPTY_VALUE_LABEL = "(Vacío)";
const SEARCHABLE_FIELD_TYPES = new Set<IEntityCrudFieldTypes>([
  "id",
  "string",
  "number",
  "boolean",
  "date",
  "enum",
  "select",
]);

const today = new Date();
today.setHours(23, 59, 59, 999);

const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
firstDayOfCurrentMonth.setHours(0, 0, 0, 0);

const entityStore = useEntityStore();
let nextCardId = 1;

const selectedProjectIds = ref<Array<number | string>>([]);
const fromDate = ref<Date | null>(firstDayOfCurrentMonth);
const toDate = ref<Date | null>(new Date(today));
const loading = ref(false);
const errorMessage = ref("");
const hasSearched = ref(false);
const dashboardCards = ref<DashboardCard[]>([
  createDashboardCard(),
  createDashboardCard(),
  createDashboardCard(),
]);

const chartTypeOptions: Array<{title: string; value: ChartType}> = [
  {title: "StackedBarChart", value: "stacked-bar"},
  {title: "BarChart", value: "bar"},
  {title: "LineChart", value: "line"},
  {title: "StackedLineChart", value: "stacked-line"},
  {title: "AreaChart", value: "area"},
];

const topItemsOptions = Array.from({length: 20}, (_, index) => ({
  title: String(index + 1),
  value: index + 1,
}));

function createDashboardCard(): DashboardCard {
  return {
    id: nextCardId++,
    fieldValue: null,
    chartType: "stacked-bar",
    topItems: 8,
    categories: [],
    series: [],
    lastFieldResult: null,
    errorMessage: "",
  };
}

function humanizeLabel(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (match) => match.toUpperCase());
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

function readRowValue(row: Record<string, unknown>, path: string): unknown {
  if (Object.prototype.hasOwnProperty.call(row, path)) {
    return row[path];
  }

  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, row);
}

function formatGroupValue(value: unknown, fieldType: IEntityCrudFieldTypes): string {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE_LABEL;
  }

  if (fieldType === "boolean") {
    return value ? "Sí" : "No";
  }

  if (fieldType === "date") {
    const date = value instanceof Date ? value : new Date(String(value));
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("es-AR");
    }
  }

  if (typeof value === "string") {
    return value.includes("_") ? humanizeLabel(value) : value;
  }

  return String(value);
}

function collectGroupableFields(
  fields: IEntityCrudField[],
  parentPath = "",
): GroupableFieldOption[] {
  const result: GroupableFieldOption[] = [];

  fields.forEach((field) => {
    const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;

    if (field.type === "object" && field.objectFields?.length) {
      result.push(...collectGroupableFields(field.objectFields, fieldPath));
      return;
    }

    if (!SEARCHABLE_FIELD_TYPES.has(field.type) || fieldPath === X_AXIS_FIELD) {
      return;
    }

    result.push({
      title: humanizeLabel(field.label || field.name),
      value: fieldPath,
      type: field.type,
    });
  });

  return result;
}

const issueAnalysisEntity = computed(() => {
  return entityStore.getEntity("RedmineIssueAnalysis");
});

const yFieldOptions = computed<GroupableFieldOption[]>(() => {
  const fields = issueAnalysisEntity.value?.fields ?? [];

  return collectGroupableFields(fields)
    .sort((left, right) => left.title.localeCompare(right.title, "es", {numeric: true, sensitivity: "base"}));
});

const fieldOptionsMap = computed(() => {
  return new Map(yFieldOptions.value.map((option) => [option.value, option]));
});

const configuredCards = computed(() => {
  return dashboardCards.value
    .map((card) => ({
      card,
      field: card.fieldValue ? fieldOptionsMap.value.get(card.fieldValue) ?? null : null,
    }))
    .filter((entry): entry is {card: DashboardCard; field: GroupableFieldOption} => Boolean(entry.field));
});

const canSearch = computed(() => configuredCards.value.length > 0);

function getFieldOption(fieldValue: string | null): GroupableFieldOption | null {
  if (!fieldValue) {
    return null;
  }

  return fieldOptionsMap.value.get(fieldValue) ?? null;
}

function getChartTypeLabel(chartType: ChartType): string {
  return chartTypeOptions.find((option) => option.value === chartType)?.title ?? "Chart";
}

function getChartComponent(chartType: ChartType) {
  return chartType === "bar" || chartType === "stacked-bar" ? BarChart : LineChart;
}

function getChartProps(chartType: ChartType) {
  return {
    stacked: chartType === "stacked-bar" || chartType === "stacked-line",
    area: chartType === "area",
  };
}

function getCardEmptyText(card: DashboardCard): string {
  if (loading.value) {
    return "Cargando datos...";
  }

  if (!card.fieldValue) {
    return "Seleccioná un campo para esta tarjeta";
  }

  if (!hasSearched.value) {
    return "Configurá la tarjeta y ejecutá una búsqueda";
  }

  if (card.errorMessage) {
    return card.errorMessage;
  }

  return "No hay datos para los filtros seleccionados";
}

function addCard(): void {
  dashboardCards.value.push(createDashboardCard());
}

function removeCard(cardId: number): void {
  if (dashboardCards.value.length === 1) {
    return;
  }

  dashboardCards.value = dashboardCards.value.filter((card) => card.id !== cardId);
}

function resetCardData(card: DashboardCard): void {
  card.categories = [];
  card.series = [];
  card.lastFieldResult = null;
  card.errorMessage = "";
}

function isNonEmptyChartLabel(label: string): boolean {
  return label !== EMPTY_VALUE_LABEL;
}

function buildFilters(): IDraxFieldFilter[] {
  const filters: IDraxFieldFilter[] = [];
  const normalizedFrom = normalizeStartDate(fromDate.value);
  const normalizedTo = normalizeEndDate(toDate.value);

  if (normalizedFrom) {
    filters.push({
      field: "issue.closedOn",
      operator: "gte",
      value: normalizedFrom,
    });
  }

  if (normalizedTo) {
    filters.push({
      field: "issue.closedOn",
      operator: "lte",
      value: normalizedTo,
    });
  }

  if (selectedProjectIds.value.length > 0) {
    filters.push({
      field: "issue.project.id",
      operator: "in",
      value: selectedProjectIds.value,
    });
  }

  return filters;
}

function limitRowsByRelevance(fieldResult: FieldResult, topItems: number): FieldResult {
  if (fieldResult.field.type === "number") {
    return {
      field: fieldResult.field,
      rows: fieldResult.rows.filter((row) => {
        const sprint = formatGroupValue(readRowValue(row, X_AXIS_FIELD), "string");
        return isNonEmptyChartLabel(sprint);
      }),
    };
  }

  const totalsByValue = new Map<string, number>();

  fieldResult.rows.forEach((row) => {
    const sprint = formatGroupValue(readRowValue(row, X_AXIS_FIELD), "string");
    const yValueLabel = formatGroupValue(readRowValue(row, fieldResult.field.value), fieldResult.field.type);

    if (!isNonEmptyChartLabel(sprint) || !isNonEmptyChartLabel(yValueLabel)) {
      return;
    }

    const count = Number(row.count ?? 0);
    totalsByValue.set(yValueLabel, (totalsByValue.get(yValueLabel) ?? 0) + count);
  });

  const allowedLabels = new Set(
    Array.from(totalsByValue.entries())
      .sort(([leftLabel, leftCount], [rightLabel, rightCount]) => {
        if (rightCount !== leftCount) {
          return rightCount - leftCount;
        }

        return leftLabel.localeCompare(rightLabel, "es", {numeric: true, sensitivity: "base"});
      })
      .slice(0, topItems)
      .map(([label]) => label),
  );

  return {
    field: fieldResult.field,
    rows: fieldResult.rows.filter((row) => {
      const sprint = formatGroupValue(readRowValue(row, X_AXIS_FIELD), "string");
      const yValueLabel = formatGroupValue(readRowValue(row, fieldResult.field.value), fieldResult.field.type);
      return isNonEmptyChartLabel(sprint) && isNonEmptyChartLabel(yValueLabel) && allowedLabels.has(yValueLabel);
    }),
  };
}

function buildChartFromResult(fieldResult: FieldResult, topItems: number): {categories: string[]; series: ChartSeries[]} {
  const limitedFieldResult = limitRowsByRelevance(fieldResult, topItems);
  const categoriesSet = new Set<string>();

  limitedFieldResult.rows.forEach((row) => {
    const sprint = formatGroupValue(readRowValue(row, X_AXIS_FIELD), "string");
    categoriesSet.add(sprint);
  });

  const categories = Array.from(categoriesSet).sort((left, right) => {
    if (left === EMPTY_VALUE_LABEL) {
      return 1;
    }

    if (right === EMPTY_VALUE_LABEL) {
      return -1;
    }

    return left.localeCompare(right, "es", {numeric: true, sensitivity: "base"});
  });

  const {field, rows} = limitedFieldResult;
  const series: ChartSeries[] = [];

  if (field.type === "number") {
    const totals = new Map<string, number>();

    rows.forEach((row) => {
      const sprint = formatGroupValue(readRowValue(row, X_AXIS_FIELD), "string");
      const value = Number(readRowValue(row, field.value) ?? 0);
      totals.set(sprint, value);
    });

    series.push({
      name: field.title,
      stack: field.value,
      data: categories.map((category) => totals.get(category) ?? 0),
    });

    return {categories, series};
  }

  const seriesByValue = new Map<string, Map<string, number>>();

  rows.forEach((row) => {
    const sprint = formatGroupValue(readRowValue(row, X_AXIS_FIELD), "string");
    const yValueLabel = formatGroupValue(readRowValue(row, field.value), field.type);
    const count = Number(row.count ?? 0);

    if (!seriesByValue.has(yValueLabel)) {
      seriesByValue.set(yValueLabel, new Map<string, number>());
    }

    seriesByValue.get(yValueLabel)?.set(sprint, count);
  });

  Array.from(seriesByValue.entries())
    .sort(([left], [right]) => left.localeCompare(right, "es", {numeric: true, sensitivity: "base"}))
    .forEach(([valueLabel, values]) => {
      series.push({
        name: valueLabel,
        stack: field.value,
        data: categories.map((category) => values.get(category) ?? 0),
      });
    });

  return {categories, series};
}

watch(
  () => dashboardCards.value.map((card) => `${card.id}:${card.topItems}`),
  () => {
    dashboardCards.value.forEach((card) => {
      if (!hasSearched.value || !card.lastFieldResult) {
        return;
      }

      const {categories, series} = buildChartFromResult(card.lastFieldResult, card.topItems);
      card.categories = categories;
      card.series = series;
    });
  },
);

async function search(): Promise<void> {
  hasSearched.value = true;
  errorMessage.value = "";

  dashboardCards.value.forEach((card) => {
    resetCardData(card);
  });

  if (!canSearch.value) {
    errorMessage.value = "Seleccioná al menos un campo en alguna tarjeta";
    return;
  }

  loading.value = true;

  try {
    const filters = buildFilters();

    await Promise.all(
      configuredCards.value.map(async ({card, field}) => {
        const rows = await RedmineIssueAnalysisProvider.instance.groupBy({
          fields: [X_AXIS_FIELD, field.value],
          filters,
        });

        const fieldResult = {
          field,
          rows: rows as GroupByRow[],
        };

        const {categories, series} = buildChartFromResult(fieldResult, card.topItems);
        card.lastFieldResult = fieldResult;
        card.categories = categories;
        card.series = series;
      }),
    );
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "No fue posible cargar el dashboard";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="text-h6">
            Dashboard dinámico por sprint
          </v-card-title>
          <v-card-subtitle>
            Eje X fijo: sprint (`issue.fixedVersion.name`)
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <redmine-remote-project-combobox
                  v-model="selectedProjectIds"
                  label="Proyectos"
                  multiple
                  :return-object="false"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-date-input
                  v-model="fromDate"
                  label="Desde"
                  prepend-icon=""
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-date-input
                  v-model="toDate"
                  label="Hasta"
                  prepend-icon=""
                />
              </v-col>
              <v-col cols="12" class="d-flex justify-space-between align-center flex-wrap ga-3">
                <div class="text-subtitle-1 font-weight-medium">
                  Tarjetas del dashboard
                </div>
                <v-btn
                  variant="outlined"
                  color="primary"
                  @click="addCard"
                >
                  Agregar tarjeta
                </v-btn>
              </v-col>
              <v-col
                v-for="(card, index) in dashboardCards"
                :key="card.id"
                cols="12"
              >
                <v-card variant="tonal" density="compact">
                  <v-card-text>
                    <div class="d-flex justify-space-between align-center mb-4 flex-wrap ga-3">
                      <div class="text-subtitle-2 font-weight-medium">
                        Tarjeta {{ index + 1 }}
                      </div>
                      <v-btn
                        variant="text"
                        color="error"
                        :disabled="dashboardCards.length === 1"
                        @click="removeCard(card.id)"
                      >
                        Eliminar
                      </v-btn>
                    </div>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-autocomplete
                          v-model="card.fieldValue"
                          :items="yFieldOptions"
                          item-title="title"
                          item-value="value"
                          label="Campo"
                          clearable
                          variant="outlined" density="compact" hide-details
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="card.chartType"
                          :items="chartTypeOptions"
                          item-title="title"
                          item-value="value"
                          label="Tipo de gráfico"
                          variant="outlined" density="compact" hide-details
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="card.topItems"
                          :items="topItemsOptions"
                          item-title="title"
                          item-value="value"
                          label="Items por campo"
                          variant="outlined" density="compact" hide-details
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  color="primary"
                  :disabled="!canSearch"
                  :loading="loading"
                  @click="search"
                >
                  Buscar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        v-if="errorMessage"
        cols="12"
      >
        <v-alert
          type="error"
          variant="tonal"
        >
          {{ errorMessage }}
        </v-alert>
      </v-col>

      <v-col
        v-for="card in dashboardCards"
        :key="`chart-${card.id}`"
        cols="12"
      >
        <v-card variant="outlined">

          <v-card-text>
            <component
              :is="getChartComponent(card.chartType)"
              :categories="card.categories"
              :series="card.series"
              :loading="loading"
              :empty-text="getCardEmptyText(card)"
              :title="`${getFieldOption(card.fieldValue)?.title ?? 'Indicador'} - ${getChartTypeLabel(card.chartType)}`"
              x-axis-name="Sprint"
              y-axis-name="Cantidad"
              :height="420"
              v-bind="getChartProps(card.chartType)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
