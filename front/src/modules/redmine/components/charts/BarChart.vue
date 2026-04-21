<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch} from "vue";
import * as echarts from "echarts/core";
import {BarChart} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";
import type {
  BarSeriesOption,
  EChartsOption,
  SetOptionOpts,
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption,
} from "echarts";

echarts.use([
  BarChart,
  CanvasRenderer,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
]);

type StackedBarChartDatum = number | null | undefined;

export type StackedBarChartSeries = {
  name: string;
  data: StackedBarChartDatum[];
  color?: string;
  stack?: string;
};

type ClickPayload = {
  category: string;
  categoryIndex: number;
  seriesName: string;
  value: number | null;
};

const props = withDefaults(defineProps<{
  categories: string[];
  series: StackedBarChartSeries[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  loading?: boolean;
  emptyText?: string;
  xAxisName?: string;
  yAxisName?: string;
  stacked?: boolean;
}>(), {
  title: "",
  subtitle: "",
  height: 360,
  loading: false,
  emptyText: "Sin datos disponibles",
  xAxisName: "",
  yAxisName: "",
  stacked: false,
});

const emit = defineEmits<{
  click: [payload: ClickPayload];
}>();

type ChartInstance = ReturnType<typeof echarts.init>;

const chartContainer = useTemplateRef("chartContainer");
const chartInstance = shallowRef<ChartInstance | null>(null);
let resizeObserver: ResizeObserver | null = null;

const containerHeight = computed(() => {
  return typeof props.height === "number" ? `${props.height}px` : props.height;
});

const hasData = computed(() => {
  return props.series.some((series) => {
    return series.data.some((value) => value !== null && value !== undefined);
  });
});

const chartOption = computed<EChartsOption>(() => {
  const title: TitleComponentOption | undefined = props.title || props.subtitle
    ? {
        text: props.title,
        subtext: props.subtitle,
        left: "center",
      }
    : undefined;

  const tooltip: TooltipComponentOption = {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    valueFormatter(value) {
      return typeof value === "number" ? value.toLocaleString("es-AR") : `${value ?? "-"}`;
    },
  };

  const grid: GridComponentOption = {
    left: 24,
    right: 24,
    bottom: 24,
    top: title ? 88 : 24,
    containLabel: true,
  };

  const legend: LegendComponentOption = {
    top: props.title || props.subtitle ? 44 : 0,
    left: "center",
    itemGap: 20,
  };

  const series: BarSeriesOption[] = props.series.map((entry) => ({
    name: entry.name,
    type: "bar",
    stack: props.stacked ? entry.stack ?? "total" : undefined,
    emphasis: {
      focus: "series",
    },
    itemStyle: entry.color ? {color: entry.color} : undefined,
    data: entry.data.map((value) => value ?? 0),
  }));

  return {
    title,
    tooltip,
    legend,
    grid,
    animationDuration: 300,
    xAxis: {
      type: "category",
      data: props.categories,
      name: props.xAxisName || undefined,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
      name: props.yAxisName || undefined,
    },
    series,
  };
});

function disposeChart(): void {
  chartInstance.value?.dispose();
  chartInstance.value = null;
}

function resizeChart(): void {
  chartInstance.value?.resize();
}

function updateChart(): void {
  if (!chartInstance.value || !hasData.value) {
    return;
  }

  const options: SetOptionOpts = {
    notMerge: true,
    lazyUpdate: true,
  };

  chartInstance.value.setOption(chartOption.value, options);
}

function setupChartEvents(): void {
  chartInstance.value?.off("click");
  chartInstance.value?.on("click", (params) => {
    const categoryIndex = typeof params.dataIndex === "number" ? params.dataIndex : -1;
    const category = categoryIndex >= 0 ? props.categories[categoryIndex] ?? "" : "";
    const rawValue = typeof params.value === "number" ? params.value : null;

    emit("click", {
      category,
      categoryIndex,
      seriesName: params.seriesName ?? "",
      value: rawValue,
    });
  });
}

async function initChart(): Promise<void> {
  await nextTick();

  if (!chartContainer.value || !hasData.value) {
    disposeChart();
    return;
  }

  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartContainer.value);
    setupChartEvents();
  }

  updateChart();

  const instance = chartInstance.value;

  if (!instance) {
    return;
  }

  if (props.loading) {
    instance.showLoading();
  } else {
    instance.hideLoading();
  }
}

onMounted(() => {
  void initChart();

  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      resizeChart();
    });
    resizeObserver.observe(chartContainer.value);
  }

  window.addEventListener("resize", resizeChart);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  window.removeEventListener("resize", resizeChart);
  disposeChart();
});

watch(hasData, () => {
  void initChart();
});

watch(chartOption, () => {
  updateChart();
}, {deep: true});

watch(() => props.loading, (loading) => {
  if (!chartInstance.value) {
    return;
  }

  if (loading) {
    chartInstance.value.showLoading();
    return;
  }

  chartInstance.value.hideLoading();
});
</script>

<template>
  <div class="bar-chart" :style="{height: containerHeight}">
    <div
      v-if="hasData"
      ref="chartContainer"
      class="bar-chart__canvas"
    />

    <div v-else class="bar-chart__empty">
      {{ emptyText }}
    </div>
  </div>
</template>

<style scoped>
.bar-chart {
  position: relative;
  width: 100%;
  min-height: 240px;
}

.bar-chart__canvas,
.bar-chart__empty {
  width: 100%;
  height: 100%;
}

.bar-chart__empty {
  display: grid;
  place-items: center;
  border: 1px dashed rgba(0, 0, 0, 0.16);
  border-radius: 12px;
  color: rgba(0, 0, 0, 0.56);
  font-size: 0.95rem;
  text-align: center;
  padding: 16px;
}
</style>
