<script setup lang="ts">
import { computed } from 'vue';
import {
  IRedmineIssue,
  IRedmineIssueRelation,
  IRedmineIssueJournalDetail
} from '../interfaces/IRedmineIssue';

const props = defineProps<{
  redmineIssue: IRedmineIssue
}>()

const getPriorityColor = (priorityName?: string) => {
  const name = priorityName?.toLowerCase() || '';
  if (name.includes('high') || name.includes('alta') || name.includes('urgent')) return 'error';
  if (name.includes('low') || name.includes('baja')) return 'info';
  return 'warning';
};

const getStatusColor = (statusName?: string, isClosed?: boolean) => {
  if (isClosed) return 'success';
  const name = statusName?.toLowerCase() || '';
  if (name.includes('progress') || name.includes('curso')) return 'primary';
  if (name.includes('new') || name.includes('nuevo')) return 'info';
  return 'secondary';
};

const formatDate = (value?: string | Date | null, includeTime = false) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString(undefined, {
    dateStyle: 'short',
    ...(includeTime ? { timeStyle: 'short' as const } : {})
  });
};

const formatHours = (value?: number | null) => {
  if (value == null) return '-';
  return `${value} h`;
};

const progressColor = computed(() => {
  const ratio = props.redmineIssue?.doneRatio || 0;
  if (ratio >= 100) return 'success';
  if (ratio > 0) return 'primary';
  return 'grey';
});

const journals = computed(() => {
  return [...(props.redmineIssue.journals || [])].sort((a, b) => {
    const left = a.createdOn ? new Date(a.createdOn).getTime() : 0;
    const right = b.createdOn ? new Date(b.createdOn).getTime() : 0;
    return right - left;
  });
});

const relationTypeLabel = (relationType?: string) => {
  if (!relationType) return 'Relacion';

  const labels: Record<string, string> = {
    relates: 'Relacionada',
    blocks: 'Bloquea',
    blocked: 'Bloqueada por',
    precedes: 'Precede',
    follows: 'Sigue a',
    copied_to: 'Copiada a',
    copied_from: 'Copiada de',
    duplicates: 'Duplica',
    duplicated: 'Duplicada por'
  };

  return labels[relationType] || relationType;
};

const relations = computed(() => {
  return [...(props.redmineIssue.relations || [])]
    .map((relation: IRedmineIssueRelation) => {
      const isSource = relation.issueId === props.redmineIssue.redmineId;
      const relatedIssueId = isSource ? relation.issueToId : relation.issueId;

      return {
        ...relation,
        relatedIssueId,
        directionLabel: isSource ? 'saliente' : 'entrante',
        relationLabel: relationTypeLabel(relation.relationType)
      };
    })
    .sort((a, b) => a.relatedIssueId - b.relatedIssueId);
});

const summaryItems = computed(() => ([
  { label: 'Autor', value: props.redmineIssue.author?.name || '-' },
  { label: 'Asignado', value: props.redmineIssue.rawPayload?.assigned_to?.name || '-' },
  { label: 'Versión', value: props.redmineIssue.fixedVersion?.name || '-' },
  { label: 'Inicio', value: formatDate(props.redmineIssue.startDate) },
  { label: 'Vencimiento', value: formatDate(props.redmineIssue.dueDate) },
  { label: 'Actualizado', value: formatDate(props.redmineIssue.updatedOn, true) }
]));

const timeItems = computed(() => ([
  { label: 'Estimado', value: formatHours(props.redmineIssue.estimatedHours) },
  { label: 'Total estimado', value: formatHours(props.redmineIssue.totalEstimatedHours) },
  { label: 'Imputado', value: formatHours(props.redmineIssue.spentHours) },
  { label: 'Total imputado', value: formatHours(props.redmineIssue.totalSpentHours), emphasized: true }
]));

const detailLabel = (detail: IRedmineIssueJournalDetail) => {
  return detail.name || detail.property || 'Cambio';
};

const detailValue = (value?: string) => value?.trim() || 'vacio';
</script>

<template>
  <div class="redmine-issue-view pa-3 pa-md-4">
    <v-card class="mb-4 rounded-lg compact-card" elevation="1" border>
      <v-card-text class="d-flex flex-column flex-lg-row justify-space-between align-start pa-4 compact-header">
        <div class="flex-grow-1 min-w-0">
          <div class="d-flex align-center flex-wrap compact-gap-sm mb-2">
            <v-chip size="small" variant="elevated" color="primary" class="font-weight-bold">
              {{ redmineIssue.project?.name || 'Proyecto' }}
            </v-chip>
            <v-chip size="small" variant="flat" color="grey-lighten-3" class="font-weight-bold text-medium-emphasis">
              {{ redmineIssue.tracker?.name || 'Issue' }}
            </v-chip>
            <span class="text-caption text-medium-emphasis font-weight-medium">
              #{{ redmineIssue.redmineId }}
            </span>
            <v-icon
              v-if="redmineIssue.isPrivate"
              color="warning"
              size="small"
              title="Issue privada"
            >
              mdi-lock
            </v-icon>
          </div>

          <h2 class="issue-title font-weight-black mb-2 text-high-emphasis">
            {{ redmineIssue.subject || 'Sin asunto' }}
          </h2>

          <div class="d-flex flex-wrap compact-gap-sm mb-3">
            <v-chip
              :color="getStatusColor(redmineIssue.status?.name, !!redmineIssue.status?.isClosed)"
              prepend-icon="mdi-flag-triangle"
              variant="elevated"
              size="small"
              class="font-weight-bold"
            >
              {{ redmineIssue.status?.name || 'Estado' }}
            </v-chip>
            <v-chip
              :color="getPriorityColor(redmineIssue.priority?.name)"
              prepend-icon="mdi-chevron-double-up"
              variant="elevated"
              size="small"
              class="font-weight-bold"
            >
              {{ redmineIssue.priority?.name || 'Prioridad' }}
            </v-chip>
            <v-chip
              variant="outlined"
              size="small"
              prepend-icon="mdi-message-text-outline"
            >
              {{ journals.length }} journals
            </v-chip>
            <v-chip
              variant="outlined"
              size="small"
              prepend-icon="mdi-source-branch"
            >
              {{ relations.length }} relaciones
            </v-chip>
          </div>

          <div class="summary-grid">
            <div
              v-for="item in summaryItems"
              :key="item.label"
              class="summary-item"
            >
              <div class="metric-label text-medium-emphasis">{{ item.label }}</div>
              <div class="metric-value font-weight-medium text-high-emphasis">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <v-card variant="outlined" class="mt-4 mt-lg-0 progress-panel rounded-lg">
          <v-card-text class="pa-3 d-flex flex-column align-center">
            <v-progress-circular
              :model-value="redmineIssue.doneRatio || 0"
              :size="66"
              :width="6"
              :color="progressColor"
            >
              <span class="text-body-1 font-weight-black">{{ redmineIssue.doneRatio || 0 }}%</span>
            </v-progress-circular>
            <span class="metric-label mt-2">Progreso</span>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <v-row dense class="compact-row">
      <v-col cols="12" lg="8">
        <v-card variant="outlined" class="rounded-lg pa-4 mb-4 compact-card">
          <div class="section-title mb-2">Descripción</div>
          <div class="description-text text-body-2">
            {{ redmineIssue.description || 'Sin descripción provista.' }}
          </div>
        </v-card>

        <v-card variant="outlined" class="rounded-lg pa-4 compact-card">
          <div class="d-flex justify-space-between align-center mb-3">
            <div class="section-title">Relaciones</div>
            <span class="text-caption text-medium-emphasis">{{ relations.length }} enlaces</span>
          </div>

          <div v-if="relations.length" class="d-flex flex-column compact-gap-sm mb-4">
            <v-card
              v-for="relation in relations"
              :key="relation.id"
              variant="outlined"
              class="journal-card"
            >
              <v-card-text class="pa-3">
                <div class="d-flex align-center justify-space-between compact-gap-sm flex-wrap">
                  <div class="d-flex align-center flex-wrap compact-gap-sm">
                    <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
                      #{{ relation.relatedIssueId }}
                    </v-chip>
                    <span class="text-body-2 font-weight-bold">{{ relation.relationLabel }}</span>
                    <v-chip size="x-small" variant="outlined">
                      {{ relation.directionLabel }}
                    </v-chip>
                  </div>
                  <span v-if="relation.delay != null" class="text-caption text-medium-emphasis">
                    Delay: {{ relation.delay }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <div v-else class="text-body-2 text-medium-emphasis mb-4">
            Este issue no tiene relaciones sincronizadas.
          </div>

          <div class="d-flex justify-space-between align-center mb-3">
            <div class="section-title">Journals</div>
            <span class="text-caption text-medium-emphasis">{{ journals.length }} entradas</span>
          </div>

          <div v-if="journals.length" class="d-flex flex-column compact-gap-sm">
            <v-card
              v-for="journal in journals"
              :key="journal.id"
              variant="outlined"
              class="journal-card"
            >
              <v-card-text class="pa-3">
                <div class="d-flex justify-space-between align-start compact-gap-sm flex-wrap mb-2">
                  <div class="d-flex align-center compact-gap-sm flex-wrap">
                    <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
                      #{{ journal.id }}
                    </v-chip>
                    <span class="text-body-2 font-weight-bold">{{ journal.user?.name || 'Sistema' }}</span>
                  </div>
                  <span class="text-caption text-medium-emphasis">
                    {{ formatDate(journal.createdOn, true) }}
                  </span>
                </div>

                <div
                  v-if="journal.notes"
                  class="journal-notes text-body-2 mb-2"
                >
                  {{ journal.notes }}
                </div>

                <div
                  v-if="journal.details?.length"
                  class="detail-list"
                >
                  <div
                    v-for="(detail, index) in journal.details"
                    :key="`${journal.id}-${index}`"
                    class="detail-row"
                  >
                    <span class="detail-name">{{ detailLabel(detail) }}</span>
                    <span class="detail-arrow">{{ detailValue(detail.oldValue) }} → {{ detailValue(detail.newValue) }}</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <div v-else class="text-body-2 text-medium-emphasis">
            Este issue no tiene journals sincronizados.
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card variant="flat" border class="rounded-lg pa-4 mb-4 compact-card">
          <div class="section-title mb-3">Tiempos</div>
          <div class="d-flex flex-column compact-gap-xs">
            <div
              v-for="item in timeItems"
              :key="item.label"
              class="dense-row"
            >
              <span class="text-body-2 text-medium-emphasis">{{ item.label }}</span>
              <span :class="item.emphasized ? 'text-primary font-weight-bold' : 'font-weight-medium'">
                {{ item.value }}
              </span>
            </div>
          </div>
        </v-card>

        <v-card
          v-if="redmineIssue.customFields?.length"
          variant="outlined"
          class="rounded-lg pa-4 compact-card"
        >
          <div class="section-title mb-3">Campos personalizados</div>
          <div class="d-flex flex-column compact-gap-xs">
            <div
              v-for="cf in redmineIssue.customFields"
              :key="cf.id"
              class="dense-field"
            >
              <div class="metric-label text-medium-emphasis">{{ cf.name }}</div>
              <div class="text-body-2 font-weight-medium">{{ cf.value || '-' }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.redmine-issue-view {
  font-size: 0.92rem;
}

.compact-card {
  border-radius: 12px !important;
}

.compact-header {
  gap: 16px;
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

.issue-title {
  font-size: clamp(1.1rem, 2vw, 1.45rem);
  line-height: 1.2;
}

.metric-label {
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.metric-value {
  font-size: 0.92rem;
  line-height: 1.25;
}

.section-title {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px 14px;
}

.summary-item {
  min-width: 0;
}

.progress-panel {
  min-width: 98px;
  align-self: flex-start;
}

.description-text {
  white-space: pre-wrap;
  line-height: 1.45;
}

.journal-card {
  border-radius: 10px !important;
}

.journal-notes {
  white-space: pre-wrap;
  line-height: 1.45;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: grid;
  grid-template-columns: minmax(90px, 140px) 1fr;
  gap: 10px;
  align-items: start;
  font-size: 0.82rem;
  line-height: 1.35;
}

.detail-name {
  font-weight: 700;
}

.detail-arrow {
  word-break: break-word;
}

.dense-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.dense-row:last-child {
  border-bottom: 0;
}

.dense-field {
  padding: 8px 10px;
  border-radius: 10px;
}

@media (max-width: 959px) {
  .detail-row {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  .progress-panel {
    align-self: stretch;
    flex-direction: row;
    justify-content: center;
    gap: 12px;
  }
}
</style>
