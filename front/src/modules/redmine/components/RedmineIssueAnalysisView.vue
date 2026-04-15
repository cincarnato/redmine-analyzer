<script setup lang="ts">
import { computed } from 'vue';
import { IRedmineIssueAnalysis } from '../interfaces/IRedmineIssueAnalysis';
import { IRedmineIssue } from '../interfaces/IRedmineIssue';
import RedmineIssueView from './RedmineIssueView.vue';

const props = defineProps<{
  redmineIssueAnalysis: IRedmineIssueAnalysis
}>()

const confianzaPorcentaje = computed(() => {
  return Math.round((props.redmineIssueAnalysis?.confianza || 0) * 100);
});

const issueDetail = computed(() => {
  return (props.redmineIssueAnalysis?.issue ?? null) as IRedmineIssue | null;
});

const getConfianzaColor = (val: number) => {
  if (val >= 80) return 'success';
  if (val >= 50) return 'warning';
  return 'error';
};
</script>

<template>
  <div class="redmine-issue-analysis-view pa-3 pa-md-4">
    <!-- Header Section -->
    <v-card class="mb-4 rounded-lg compact-card" elevation="1" border>
      <v-card-text class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center pa-4">
        <div class="flex-grow-1">
          <div class="d-flex align-center flex-wrap compact-gap-sm mb-1">
            <v-chip size="small" color="primary" class="font-weight-bold text-uppercase" variant="elevated">
              {{ redmineIssueAnalysis.categoria || 'Sin Categoría' }}
            </v-chip>
            <span class="text-caption text-medium-emphasis font-weight-medium">
              ID: #{{ redmineIssueAnalysis.redmineIssue?.id || 'N/A' }}
            </span>
          </div>
          <h2 class="analysis-title font-weight-black mb-0 text-high-emphasis">
            {{ redmineIssueAnalysis.resumen || 'Sin Resumen' }}
          </h2>
        </div>

        <div class="mt-3 mt-md-0 d-flex flex-column align-center bg-grey-lighten-4 pa-3 rounded-lg confidence-panel">
          <v-progress-circular
            :model-value="confianzaPorcentaje"
            :size="64"
            :width="6"
            :color="getConfianzaColor(confianzaPorcentaje)"
          >
            <span class="text-body-1 font-weight-black">{{ confianzaPorcentaje }}%</span>
          </v-progress-circular>
          <span class="text-caption mt-1 font-weight-bold text-uppercase">Confianza</span>
        </div>
      </v-card-text>
    </v-card>

    <!-- Status Flags Row -->
    <div class="d-flex flex-wrap compact-gap-sm mb-4">
      <v-chip
        v-if="redmineIssueAnalysis.esError"
        color="error"
        prepend-icon="mdi-alert-circle"
        variant="elevated"
        class="font-weight-bold"
        size="small"
      >
        Es Error
      </v-chip>
      <v-chip
        v-if="redmineIssueAnalysis.esRetrabajo"
        color="warning"
        prepend-icon="mdi-history"
        variant="elevated"
        class="font-weight-bold"
        size="small"
      >
        Es Retrabajo
      </v-chip>
      <v-chip
        v-if="redmineIssueAnalysis.esCambioMenor"
        color="info"
        prepend-icon="mdi-pencil-circle"
        variant="flat"
        class="font-weight-bold"
        size="small"
      >
        Cambio Menor
      </v-chip>
      <v-chip
        v-if="redmineIssueAnalysis.estaBloqueado"
        color="error"
        prepend-icon="mdi-block-helper"
        variant="elevated"
        class="font-weight-bold"
        size="small"
      >
        Bloqueado
      </v-chip>
    </div>

    <v-row dense class="compact-row">
      <!-- Left Column: Classification & Reason -->
      <v-col cols="12" md="8">
        <!-- Conditional Rework Notice -->
        <v-alert
          v-if="redmineIssueAnalysis.esRetrabajo && redmineIssueAnalysis.motivoRetrabajo"
          icon="mdi-alert"
          color="warning"
          variant="tonal"
          border="start"
          class="mb-4 rounded-lg compact-alert"
          title="Motivo de Retrabajo"
        >
          <div class="text-body-2 font-italic font-weight-medium mt-1">
            "{{ redmineIssueAnalysis.motivoRetrabajo }}"
          </div>
        </v-alert>

        <!-- Classification Grid -->
        <v-row dense class="mb-4">
          <v-col cols="12" sm="6">
            <v-card variant="flat" color="grey-lighten-4" class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card">
              <div>
                <div class="metric-label text-medium-emphasis">Tipo Objetivo</div>
                <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.tipoObjetivo || '-' }}</div>
              </div>
              <v-icon size="large" color="primary" class="opacity-30">mdi-target</v-icon>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card variant="flat" color="grey-lighten-4" class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card">
              <div>
                <div class="metric-label text-medium-emphasis">Nivel Valor</div>
                <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.nivelValor || '-' }}</div>
              </div>
              <v-icon size="large" color="primary" class="opacity-30">mdi-diamond-stone</v-icon>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card variant="flat" color="grey-lighten-4" class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card">
              <div>
                <div class="metric-label text-medium-emphasis">Complejidad</div>
                <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.nivelComplejidad || '-' }}</div>
              </div>
              <v-icon size="large" color="primary" class="opacity-30">mdi-head-cog</v-icon>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card variant="flat" color="grey-lighten-4" class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card">
              <div>
                <div class="metric-label text-medium-emphasis">Urgencia</div>
                <div class="metric-value font-weight-bold text-error">{{ redmineIssueAnalysis.nivelUrgencia || '-' }}</div>
              </div>
              <v-icon size="large" color="error" class="opacity-30">mdi-alert-octagon</v-icon>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card variant="flat" color="grey-lighten-4" class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card">
              <div>
                <div class="metric-label text-medium-emphasis">Detectabilidad Dev</div>
                <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.nivelDetectabilidadDesarrollo || '-' }}</div>
              </div>
              <v-icon size="large" color="warning" class="opacity-30">mdi-radar</v-icon>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card variant="flat" color="grey-lighten-4" class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card">
              <div>
                <div class="metric-label text-medium-emphasis">Trabajo Técnico</div>
                <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.tipoTrabajoTecnico || '-' }}</div>
              </div>
              <v-icon size="large" color="primary" class="opacity-30">mdi-layers-triple</v-icon>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card variant="flat" color="grey-lighten-4" class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card">
              <div>
                <div class="metric-label text-medium-emphasis">Grupo Objetivo</div>
                <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.grupoObjetivo || '-' }}</div>
              </div>
              <v-icon size="large" color="primary" class="opacity-30">mdi-account-group</v-icon>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card variant="flat" color="grey-lighten-4" class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card">
              <div>
                <div class="metric-label text-medium-emphasis">Área Funcional</div>
                <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.areaFuncional || '-' }}</div>
              </div>
              <v-icon size="large" color="primary" class="opacity-30">mdi-puzzle</v-icon>
            </v-card>
          </v-col>
        </v-row>

        <!-- Probable Outcome -->
        <v-card border elevation="0" class="rounded-lg pa-4 border-opacity-25 compact-card" v-if="redmineIssueAnalysis.resultadoProbable">
          <div class="metric-label text-medium-emphasis mb-1">Resultado Probable</div>
          <div class="text-body-1 font-weight-bold text-primary">{{ redmineIssueAnalysis.resultadoProbable }}</div>
        </v-card>
      </v-col>

      <!-- Right Column: Impact & Signals -->
      <v-col cols="12" md="4">
        <!-- Impact Areas -->
        <v-card variant="flat" color="grey-lighten-4" class="rounded-lg pa-4 mb-4 compact-card">
          <div class="metric-label font-weight-bold mb-2">Áreas de Impacto</div>
          <div v-if="redmineIssueAnalysis.areasImpacto && redmineIssueAnalysis.areasImpacto.length" class="d-flex flex-column compact-gap-sm">
            <v-card
              v-for="area in redmineIssueAnalysis.areasImpacto"
              :key="area"
              class="d-flex align-center pa-2 rounded-lg elevation-0 compact-list-item"
            >
              <v-avatar color="primary-lighten-4" size="28" class="mr-2 text-primary">
                <v-icon size="small">mdi-check-circle-outline</v-icon>
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ area }}</span>
            </v-card>
          </div>
          <div v-else class="text-caption text-medium-emphasis font-italic">No hay áreas identificadas</div>
        </v-card>

        <!-- Waste Signals -->
        <v-card variant="tonal" color="deep-purple-darken-1" class="rounded-lg pa-4 mb-4 bg-deep-purple-lighten-5 compact-card">
          <div class="metric-label font-weight-bold mb-2 text-deep-purple-darken-3">Señales de Desperdicio</div>
          <div class="d-flex flex-wrap compact-gap-xs">
            <template v-if="redmineIssueAnalysis.senialesDesperdicio && redmineIssueAnalysis.senialesDesperdicio.length">
              <v-chip
                v-for="st in redmineIssueAnalysis.senialesDesperdicio"
                :key="st"
                color="deep-purple-darken-2"
                variant="outlined"
                class="font-weight-bold bg-white"
                size="small"
              >
                {{ st }}
              </v-chip>
            </template>
            <span v-else class="text-caption font-italic text-deep-purple-darken-3">No hay señales de desperdicio</span>
          </div>
        </v-card>

        <!-- Process Signals -->
        <v-card variant="tonal" color="primary" class="rounded-lg pa-4 bg-blue-grey-lighten-5 compact-card">
          <div class="metric-label font-weight-bold mb-2 text-primary">Señales de Proceso</div>

          <v-timeline density="compact" align="start" truncate-line="both" class="compact-timeline">
            <template v-if="redmineIssueAnalysis.senialesProceso && redmineIssueAnalysis.senialesProceso.length">
              <v-timeline-item
                v-for="sp in redmineIssueAnalysis.senialesProceso"
                :key="sp"
                dot-color="primary"
                size="small"
              >
                <div class="text-caption font-weight-bold process-item">{{ sp }}</div>
              </v-timeline-item>
            </template>
            <div v-else class="text-caption font-italic text-primary">No hay señales de proceso</div>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>

    <v-card
      v-if="issueDetail"
      class="mt-4 rounded-lg compact-card"
      elevation="1"
      border
    >
      <v-expansion-panels variant="accordion" class="ticket-expansion">
        <v-expansion-panel>
          <v-expansion-panel-title class="font-weight-bold">
            Ver ticket Redmine
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <RedmineIssueView :redmine-issue="issueDetail" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<style scoped>
.redmine-issue-analysis-view {
  font-size: 0.93rem;
}

.analysis-title {
  font-size: clamp(1.15rem, 2vw, 1.55rem);
  line-height: 1.2;
}

.metric-label {
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.metric-value {
  font-size: 0.98rem;
  line-height: 1.25;
}

.compact-card {
  border-radius: 12px !important;
}

.ticket-expansion {
  border-radius: 12px;
}

:deep(.ticket-expansion .v-expansion-panel-text__wrapper) {
  padding: 0;
}

.compact-metric-card {
  min-height: 84px;
}

.compact-list-item {
  min-height: 0;
}

.compact-alert :deep(.v-alert-title) {
  font-size: 0.82rem;
}

.compact-gap-xs {
  gap: 6px;
}

.compact-gap-sm {
  gap: 8px;
}

.compact-row {
  row-gap: 0;
}

.confidence-panel {
  min-width: 96px;
}

.compact-timeline {
  margin-inline: 0;
}

.process-item {
  line-height: 1.3;
}

.opacity-30 {
  opacity: 0.3;
}

.hover-elevate:hover {
  background-color: rgb(var(--v-theme-surface)) !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-1px);
}
</style>
