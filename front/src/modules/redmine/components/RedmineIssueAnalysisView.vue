<script setup lang="ts">
import { computed } from 'vue';
import { IRedmineIssueAnalysis } from '../interfaces/IRedmineIssueAnalysis';
import { IRedmineIssue } from '../interfaces/IRedmineIssue';
import RedmineIssueView from './RedmineIssueView.vue';

const props = defineProps<{
  redmineIssueAnalysis: IRedmineIssueAnalysis
}>()

const issueDetail = computed(() => {
  return (props.redmineIssueAnalysis?.issue ?? null) as IRedmineIssue | null;
});

const hasErrorAnalysis = computed(() => {
  const causaError = props.redmineIssueAnalysis?.causaError?.trim();
  const severidadError = props.redmineIssueAnalysis?.severidadError?.trim();

  return Boolean(causaError && severidadError);
});

const hasDefinicionAnalysis = computed(() => {
  const causaError = props.redmineIssueAnalysis?.calidadCriteriosAceptacion?.trim();
  const severidadError = props.redmineIssueAnalysis?.atomicidad?.trim();

  return Boolean(causaError && severidadError);
});

const errorCauseDescriptions: Record<string, string> = {
  criterio_fallido: 'La funcionalidad entregada no cumple con los criterios de aceptación definidos.',
  regresion: 'Una funcionalidad que antes funcionaba correctamente dejó de hacerlo por cambios recientes.',
  definicion_incompleta: 'Se detecta un problema pero no hay criterios claros que definan el comportamiento esperado.',
  detalle_menor: 'Error de bajo impacto que no impide el uso, pero afecta calidad o prolijidad.',
  oportunidad_de_mejora: 'No es un error, pero se identifica en pruebas QA una mejora clara en usabilidad, eficiencia o diseño.',
  problema_de_integracion: 'El error se origina en la interacción con sistemas externos o APIs.',
  problema_de_datos: 'El error se debe a datos incorrectos, inconsistentes o corruptos.',
  problema_de_entorno: 'El problema está en la configuración del sistema o diferencias entre entornos.',
  error_de_usuario: 'El comportamiento incorrecto se debe a un uso indebido del sistema, no a un bug.',
  caso_borde: 'El error ocurre en un escenario poco común que no fue considerado en el diseño original.',
};

const errorSeverityDescriptions: Record<string, string> = {
  bloqueante: 'El sistema o funcionalidad queda totalmente inutilizable. No hay workaround.',
  critico: 'El sistema funciona parcialmente, pero hay un impacto severo en operaciones clave.',
  alto: 'Hay un problema importante, pero existe workaround o no bloquea completamente la operación.',
  medio: 'Problema moderado que no impacta significativamente la operación, pero debería corregirse.',
  bajo: 'Impacto mínimo, generalmente relacionado a detalles visuales o mejoras menores.',
};

const errorTypeDescriptions: Record<string, string> = {
  funcional: 'El sistema no cumple la funcionalidad esperada.',
  regla_de_negocio: 'La implementación no respeta reglas del negocio, aunque técnicamente funcione.',
  validacion: 'Problemas en las reglas de validación de datos de entrada.',
  seguridad: 'Existe un riesgo de acceso indebido, exposición de datos o vulnerabilidad.',
  performance: 'El sistema presenta lentitud, consumo excesivo de recursos o baja eficiencia.',
  interfaz: 'Problemas en la experiencia de usuario o presentación visual.',
  integracion: 'Problemas en la comunicación con sistemas externos.',
  integridad_de_datos: 'Los datos son incorrectos, inconsistentes o se corrompen.',
  compatibilidad: 'El sistema no funciona correctamente en ciertos dispositivos, navegadores o entornos.',
  configuracion: 'El problema está en configuración incorrecta del sistema.',
  infraestructura: 'El problema proviene de infraestructura o entorno técnico.',
};

const errorCauseOptions = [
  { value: 'criterio_fallido', description: errorCauseDescriptions.criterio_fallido },
  { value: 'regresion', description: errorCauseDescriptions.regresion },
  { value: 'definicion_incompleta', description: errorCauseDescriptions.definicion_incompleta },
  { value: 'detalle_menor', description: errorCauseDescriptions.detalle_menor },
  { value: 'oportunidad_de_mejora', description: errorCauseDescriptions.oportunidad_de_mejora },
  { value: 'problema_de_integracion', description: errorCauseDescriptions.problema_de_integracion },
  { value: 'problema_de_datos', description: errorCauseDescriptions.problema_de_datos },
  { value: 'problema_de_entorno', description: errorCauseDescriptions.problema_de_entorno },
  { value: 'error_de_usuario', description: errorCauseDescriptions.error_de_usuario },
  { value: 'caso_borde', description: errorCauseDescriptions.caso_borde },
];

const errorSeverityOptions = [
  { value: 'bloqueante', description: errorSeverityDescriptions.bloqueante },
  { value: 'critico', description: errorSeverityDescriptions.critico },
  { value: 'alto', description: errorSeverityDescriptions.alto },
  { value: 'medio', description: errorSeverityDescriptions.medio },
  { value: 'bajo', description: errorSeverityDescriptions.bajo },
];

const errorTypeOptions = [
  { value: 'funcional', description: errorTypeDescriptions.funcional },
  { value: 'regla_de_negocio', description: errorTypeDescriptions.regla_de_negocio },
  { value: 'validacion', description: errorTypeDescriptions.validacion },
  { value: 'seguridad', description: errorTypeDescriptions.seguridad },
  { value: 'performance', description: errorTypeDescriptions.performance },
  { value: 'interfaz', description: errorTypeDescriptions.interfaz },
  { value: 'integracion', description: errorTypeDescriptions.integracion },
  { value: 'integridad_de_datos', description: errorTypeDescriptions.integridad_de_datos },
  { value: 'compatibilidad', description: errorTypeDescriptions.compatibilidad },
  { value: 'configuracion', description: errorTypeDescriptions.configuracion },
  { value: 'infraestructura', description: errorTypeDescriptions.infraestructura },
];

const formatEnumLabel = (value?: string | null) => {
  if (!value) return '-';

  return value
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

const errorAnalysisItems = computed(() => [
  {
    title: 'Causa Error',
    value: props.redmineIssueAnalysis?.causaError,
    description: errorCauseDescriptions[props.redmineIssueAnalysis?.causaError ?? ''],
    icon: 'mdi-source-branch-alert',
    color: 'error',
    options: errorCauseOptions,
  },
  {
    title: 'Severidad Error',
    value: props.redmineIssueAnalysis?.severidadError,
    description: errorSeverityDescriptions[props.redmineIssueAnalysis?.severidadError ?? ''],
    icon: 'mdi-alert-decagram',
    color: 'error',
    options: errorSeverityOptions,
  },
  {
    title: 'Tipo Error',
    value: props.redmineIssueAnalysis?.tipoError,
    description: errorTypeDescriptions[props.redmineIssueAnalysis?.tipoError ?? ''],
    icon: 'mdi-bug-outline',
    color: 'warning',
    options: errorTypeOptions,
  },
  {
    title: 'Detectabilidad Dev',
    value: props.redmineIssueAnalysis?.nivelDetectabilidadDesarrollo,
    description: 'Indica cuan probable es que el problema sea detectado durante el desarrollo antes de llegar a QA o produccion.',
    icon: 'mdi-radar',
    color: 'warning',
    options: [],
  },
]);

const contextAnalysisItems = computed(() => [
  {
    title: 'Categoría',
    value: props.redmineIssueAnalysis?.categoria,
    icon: 'mdi-shape-outline',
    color: 'primary',
  },
  {
    title: 'Objetivo',
    value: props.redmineIssueAnalysis?.objetivo,
    icon: 'mdi-target',
    color: 'primary',
  },
  {
    title: 'Módulo',
    value: props.redmineIssueAnalysis?.modulo,
    icon: 'mdi-view-grid-outline',
    color: 'primary',
  },
  {
    title: 'Valor Negocio',
    value: props.redmineIssueAnalysis?.valorNegocio,
    icon: 'mdi-diamond-stone',
    color: 'primary',
  },
  {
    title: 'Complejidad',
    value: props.redmineIssueAnalysis?.complejidad,
    icon: 'mdi-head-cog',
    color: 'primary',
  },
  {
    title: 'Urgencia',
    value: props.redmineIssueAnalysis?.nivelUrgencia,
    icon: 'mdi-alert-octagon',
    color: 'error',
  },
  {
    title: 'Rol Objetivo',
    value: props.redmineIssueAnalysis?.rolObjetivo,
    icon: 'mdi-account-group',
    color: 'primary',
  },
  {
    title: 'Área Funcional',
    value: props.redmineIssueAnalysis?.areaFuncional,
    icon: 'mdi-puzzle',
    color: 'primary',
  },
]);

const definitionAnalysisItems = computed(() => [
  {
    title: 'Calidad Criterios',
    value: props.redmineIssueAnalysis?.calidadCriteriosAceptacion,
    icon: 'mdi-format-list-checks',
    color: 'success',
  },
  {
    title: 'Atomicidad',
    value: props.redmineIssueAnalysis?.atomicidad,
    icon: 'mdi-toy-brick-outline',
    color: 'primary',
  },
  {
    title: 'Ambigüedad',
    value: props.redmineIssueAnalysis?.ambiguedadDefinicion,
    icon: 'mdi-chat-question-outline',
    color: 'warning',
  },
  {
    title: 'Claridad Alcance',
    value: props.redmineIssueAnalysis?.claridadAlcance,
    icon: 'mdi-image-filter-center-focus',
    color: 'info',
  },
  {
    title: 'Testabilidad',
    value: props.redmineIssueAnalysis?.testabilidad,
    icon: 'mdi-flask-check-outline',
    color: 'success',
  },
  {
    title: 'Consistencia',
    value: props.redmineIssueAnalysis?.consistencia,
    icon: 'mdi-set-center',
    color: 'primary',
  },
  {
    title: 'Riesgo Error QA',
    value: props.redmineIssueAnalysis?.riesgoErrorQA,
    icon: 'mdi-shield-alert-outline',
    color: 'error',
  },
]);
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
              ID: #{{ redmineIssueAnalysis.issue?.redmineId || 'N/A' }}
            </span>
          </div>
          <h2 class="font-weight-bold mb-0 text-high-emphasis">
            {{ redmineIssueAnalysis.resumen || 'Sin Resumen' }}
          </h2>
        </div>

      </v-card-text>
    </v-card>

    <v-row dense class="compact-row">
      <v-col  cols="12">
        <v-card class="mb-4 rounded-lg compact-card h-100" elevation="1" border>
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between flex-wrap compact-gap-sm mb-4">
              <div>
                <div class="metric-label text-medium-emphasis">Contexto Funcional</div>
                <div class="section-title font-weight-bold text-high-emphasis">Priorización y alcance</div>
              </div>
              <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold">
                Contexto
              </v-chip>
            </div>

            <v-row dense>
              <v-col
                v-for="item in contextAnalysisItems"
                :key="item.title"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  variant="outlined"
                  class="rounded-lg pa-4 d-flex align-start justify-space-between transition-swing hover-elevate compact-metric-card"
                >
                  <div class="pr-4">
                    <div class="metric-label text-medium-emphasis">{{ item.title }}</div>
                    <div class="metric-value font-weight-bold">{{ item.value || '-' }}</div>
                  </div>
                  <v-icon :color="item.color" size="large" class="opacity-30">{{ item.icon }}</v-icon>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4" lg="3">
                <v-card
                  variant="tonal"
                  color="primary"
                  class="rounded-lg pa-4 compact-metric-card h-100"
                >
                  <div class="metric-label font-weight-bold mb-2 text-primary">Señales</div>
                  <div class="d-flex flex-wrap compact-gap-xs">
                    <template v-if="redmineIssueAnalysis.seniales && redmineIssueAnalysis.seniales.length">
                      <v-chip
                        v-for="senial in redmineIssueAnalysis.seniales"
                        :key="senial"
                        color="primary"
                        variant="outlined"
                        class="font-weight-bold"
                        size="small"
                      >
                        {{ senial }}
                      </v-chip>
                    </template>
                    <span v-else class="text-caption font-italic text-primary">No hay señales identificadas</span>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4" lg="3">
                <v-card
                  variant="outlined"
                  class="rounded-lg h-100 pa-3 d-flex align-center justify-space-between transition-swing hover-elevate compact-metric-card"
                >
                  <div>
                    <div class="metric-label text-medium-emphasis">Trabajo Técnico</div>
                    <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.tipoTrabajoTecnico || '-' }}</div>
                  </div>
                  <v-icon size="large" color="primary" class="opacity-30">mdi-layers-triple</v-icon>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="hasErrorAnalysis">
        <v-card class="mb-4 rounded-lg compact-card h-100" elevation="1" border>
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between flex-wrap compact-gap-sm mb-4">
              <div>
                <div class="metric-label text-medium-emphasis">Análisis de Error</div>
                <div class="section-title font-weight-bold text-high-emphasis">Clasificación del incidente</div>
              </div>
              <v-chip size="small" color="error" variant="tonal" class="font-weight-bold">
                Clasificación
              </v-chip>
            </div>

            <v-row dense>
              <v-col
                v-for="item in errorAnalysisItems"
                :key="item.title"
                cols="12"
              >
                <v-card
                  variant="outlined"
                  class="rounded-lg pa-4 d-flex align-start justify-space-between transition-swing hover-elevate error-analysis-card"
                >
                  <div class="pr-4">
                    <div class="d-flex align-center compact-gap-xs mb-1">
                      <div class="metric-label text-medium-emphasis">{{ item.title }}</div>
                      <v-menu
                        v-if="item.options?.length"
                        location="bottom end"
                        max-width="420"
                      >
                        <template #activator="{ props: menuProps }">
                          <v-btn
                            v-bind="menuProps"
                            icon="mdi-help-circle-outline"
                            size="x-small"
                            variant="text"
                            density="comfortable"
                            color="medium-emphasis"
                          />
                        </template>

                        <v-card class="rounded-lg help-menu-card" elevation="4">
                          <v-card-text class="pa-3">
                            <div class="help-menu-title font-weight-bold mb-2">{{ item.title }}</div>
                            <div class="d-flex flex-column compact-gap-sm">
                              <div
                                v-for="option in item.options"
                                :key="option.value"
                                class="help-option"
                              >
                                <div class="text-body-2 font-weight-bold">{{ formatEnumLabel(option.value) }}</div>
                                <div class="text-caption text-medium-emphasis">{{ option.description }}</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </div>
                    <div class="metric-value font-weight-bold mb-2">{{ formatEnumLabel(item.value) }}</div>
                    <div class="metric-description text-medium-emphasis">
                      {{ item.description || 'Sin descripcion disponible para este valor.' }}
                    </div>
                  </div>
                  <v-icon :color="item.color" size="large" class="opacity-30">{{ item.icon }}</v-icon>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="hasDefinicionAnalysis">
        <v-card class="rounded-lg compact-card" elevation="1" border>
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between flex-wrap compact-gap-sm mb-4">
              <div>
                <div class="metric-label text-medium-emphasis">Definición de Story</div>
                <div class="section-title font-weight-bold text-high-emphasis">Calidad y criterios de refinamiento</div>
              </div>
              <v-chip size="small" color="success" variant="tonal" class="font-weight-bold">
                Definición
              </v-chip>
            </div>

            <v-row dense>
              <v-col
                v-for="item in definitionAnalysisItems"
                :key="item.title"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card
                  variant="outlined"
                  class="rounded-lg pa-4 d-flex align-start justify-space-between transition-swing hover-elevate compact-metric-card"
                >
                  <div class="pr-4">
                    <div class="metric-label text-medium-emphasis">{{ item.title }}</div>
                    <div class="metric-value font-weight-bold">{{ formatEnumLabel(item.value) }}</div>
                  </div>
                  <v-icon :color="item.color" size="large" class="opacity-30">{{ item.icon }}</v-icon>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card
                  variant="outlined"
                  class="rounded-lg pa-4 d-flex align-start justify-space-between transition-swing hover-elevate compact-metric-card"
                >
                  <div class="pr-4">
                    <div class="metric-label text-medium-emphasis">Requiere Refinamiento</div>
                    <div class="metric-value font-weight-bold">
                      {{ redmineIssueAnalysis.requiereRefinamiento === undefined ? '-' : (redmineIssueAnalysis.requiereRefinamiento ? 'Sí' : 'No') }}
                    </div>
                  </div>
                  <v-icon color="warning" size="large" class="opacity-30">mdi-file-document-edit-outline</v-icon>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card
                  variant="outlined"
                  class="rounded-lg pa-4 d-flex align-start justify-space-between transition-swing hover-elevate compact-metric-card"
                >
                  <div class="pr-4">
                    <div class="metric-label text-medium-emphasis">Objetivos Detectados</div>
                    <div class="metric-value font-weight-bold">{{ redmineIssueAnalysis.cantidadObjetivosDetectados ?? '-' }}</div>
                  </div>
                  <v-icon color="primary" size="large" class="opacity-30">mdi-target-variant</v-icon>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card
                  variant="tonal"
                  color="success"
                  class="rounded-lg pa-4 compact-metric-card h-100"
                >
                  <div class="metric-label font-weight-bold mb-2 text-success">Hallazgos</div>
                  <div class="d-flex flex-wrap compact-gap-xs">
                    <template v-if="redmineIssueAnalysis.hallazgosDefinicion && redmineIssueAnalysis.hallazgosDefinicion.length">
                      <v-chip
                        v-for="hallazgo in redmineIssueAnalysis.hallazgosDefinicion"
                        :key="hallazgo"
                        color="success"
                        variant="outlined"
                        class="font-weight-bold"
                        size="small"
                      >
                        {{ formatEnumLabel(hallazgo) }}
                      </v-chip>
                    </template>
                    <span v-else class="text-caption font-italic text-success">No hay hallazgos identificados</span>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card
                  variant="outlined"
                  class="rounded-lg pa-4 h-100"
                >
                  <div class="metric-label text-medium-emphasis mb-2">Observaciones</div>
                  <div class="metric-description text-body-2">
                    {{ redmineIssueAnalysis.observacionesDefinicion || 'Sin observaciones adicionales.' }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
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


.metric-label {
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.metric-value {
  font-size: 0.98rem;
  line-height: 1.25;
}

.metric-description {
  font-size: 0.85rem;
  line-height: 1.35;
}

.section-title {
  font-size: 1rem;
  line-height: 1.25;
}

.help-menu-card {
  max-height: 360px;
  overflow-y: auto;
}

.help-menu-title {
  font-size: 0.9rem;
}

.help-option {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.help-option:last-child {
  padding-bottom: 0;
  border-bottom: 0;
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

.error-analysis-card {
  min-height: 124px;
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
  transform: translateY(-1px);
}
</style>
