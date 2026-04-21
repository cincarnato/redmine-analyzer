<script setup lang="ts">
import {computed, ref} from 'vue'
import RedmineIssueAnalysisProvider from '../../providers/RedmineIssueAnalysisProvider'
import RedmineIssueAnalysisView from '../../components/RedmineIssueAnalysisView.vue'
import type {IRedmineIssueAnalysis} from '../../interfaces/IRedmineIssueAnalysis'
import type {IRedmineIssueAssistResult} from '../../interfaces/IRedmineIssueAssist'

interface IAssistHistoryItem {
  id: number
  createdAt: Date
  userInput: string
  baseDescription: string
  result: IRedmineIssueAssistResult
  editedDescription: string
}

type DescriptionMode = 'editableRaw' | 'readonlyRaw' | 'readonlyTextile'

const analysisProvider = RedmineIssueAnalysisProvider.instance

const redmineId = ref<string>('')
const userInput = ref<string>('')
const currentDescription = ref<string>('')
const analysis = ref<IRedmineIssueAnalysis | null>(null)
const analyzing = ref(false)
const assisting = ref(false)
const errorMsg = ref<string | null>(null)
const okMsg = ref<string | null>(null)
const copied = ref(false)
const history = ref<IAssistHistoryItem[]>([])
const historyPanels = ref<number[]>([])
const activeTab = ref<'analysis' | 'proposal' | 'history'>('analysis')
const descriptionMode = ref<DescriptionMode>('editableRaw')

const canAnalyze = computed(() => redmineId.value.trim().length > 0 && !analyzing.value && !assisting.value)
const canAssist = computed(() => Boolean(analysis.value) && !analyzing.value && !assisting.value)
const canReanalyzeCurrentDescription = computed(() => canAnalyze.value && currentDescription.value.trim().length > 0)
const renderedDescription = computed(() => renderTextile(currentDescription.value))

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeUrl(value: string) {
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(value)) {
    return value
  }

  return '#'
}

function renderInlineTextile(value: string) {
  return escapeHtml(value)
    .replace(/@([^@]+)@/g, '<code>$1</code>')
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/"([^"]+)":(\S+)/g, (_match, label: string, url: string) => {
      return `<a href="${escapeHtml(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${label}</a>`
    })
}

function renderTextile(value: string) {
  const lines = value.split(/\r?\n/)
  const html: string[] = []
  let openList: 'ul' | 'ol' | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      if (openList) {
        html.push(`</${openList}>`)
        openList = null
      }
      continue
    }

    const headingMatch = trimmed.match(/^h([1-6])\.\s+(.+)$/)
    const unorderedListMatch = trimmed.match(/^\*\s+(.+)$/)
    const orderedListMatch = trimmed.match(/^#\s+(.+)$/)

    if (headingMatch) {
      if (openList) {
        html.push(`</${openList}>`)
        openList = null
      }

      const level = headingMatch[1]
      html.push(`<h${level}>${renderInlineTextile(headingMatch[2])}</h${level}>`)
      continue
    }

    if (unorderedListMatch || orderedListMatch) {
      const listTag = unorderedListMatch ? 'ul' : 'ol'
      const content = unorderedListMatch?.[1] ?? orderedListMatch?.[1] ?? ''

      if (openList && openList !== listTag) {
        html.push(`</${openList}>`)
        openList = null
      }

      if (!openList) {
        html.push(`<${listTag}>`)
        openList = listTag
      }

      html.push(`<li>${renderInlineTextile(content)}</li>`)
      continue
    }

    if (openList) {
      html.push(`</${openList}>`)
      openList = null
    }

    html.push(`<p>${renderInlineTextile(trimmed)}</p>`)
  }

  if (openList) {
    html.push(`</${openList}>`)
  }

  return html.join('')
}

async function analyze(descriptionOverride?: string) {
  if (!canAnalyze.value) {
    return
  }

  analyzing.value = true
  errorMsg.value = null
  okMsg.value = null

  try {
    const result = await analysisProvider.analyzeIssue({
      redmineId: redmineId.value.trim(),
      descriptionOverride
    })

    analysis.value = result.analysis
    currentDescription.value = result.analysis.issue?.description ?? currentDescription.value
    activeTab.value = 'analysis'
    okMsg.value = 'Análisis ejecutado correctamente'
  } catch (e: any) {
    console.error('Error analyzing Redmine issue:', e)
    errorMsg.value = e?.message ?? 'No se pudo analizar el ticket'
  } finally {
    analyzing.value = false
  }
}

async function assist() {
  if (!canAssist.value || !analysis.value) {
    return
  }

  assisting.value = true
  errorMsg.value = null
  okMsg.value = null

  const baseDescription = currentDescription.value
  const promptInput = userInput.value

  try {
    const result = await analysisProvider.assistIssue({
      redmineId: redmineId.value.trim(),
      currentDescription: baseDescription,
      userInput: promptInput,
      analysis: analysis.value
    })

    currentDescription.value = result.descripcionPropuesta
    history.value.unshift({
      id: Date.now(),
      createdAt: new Date(),
      userInput: promptInput,
      baseDescription,
      result,
      editedDescription: result.descripcionPropuesta
    })
    historyPanels.value = [0]
    activeTab.value = 'proposal'
    userInput.value = ''
    okMsg.value = 'Propuesta generada. Puedes editarla antes de iterar o copiarla.'
  } catch (e: any) {
    console.error('Error assisting Redmine issue:', e)
    errorMsg.value = e?.message ?? 'No se pudo generar la asistencia IA'
  } finally {
    assisting.value = false
  }
}

async function copyDescription() {
  copied.value = false

  try {
    await navigator.clipboard.writeText(currentDescription.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch (e) {
    console.error('Error copying description:', e)
    errorMsg.value = 'No se pudo copiar la descripción'
  }
}

function analyzeEditedDescription() {
  void analyze(currentDescription.value)
}

function formatDate(value: Date) {
  return value.toLocaleString()
}
</script>

<template>
  <v-container class="py-4" fluid>
    <v-card class="assist-hero mb-4" elevation="1">
      <v-card-text class="pa-3">
        <div class="d-flex align-center justify-space-between ga-3">
          <div class="assist-hero-content">
            <div class="text-caption text-primary font-weight-bold text-uppercase">Asistencia IA Redmine</div>
            <h1 class="text-h6 font-weight-bold mb-1">Refinar una user story específica</h1>
            <div class="text-caption text-medium-emphasis">
              Ejecuta el mismo análisis funcional para un Redmine ID puntual y usa el resultado como contexto para mejorar la descripción del ticket.
            </div>
          </div>

          <v-icon class="hero-icon" color="primary">mdi-text-box-edit-outline</v-icon>
        </div>
      </v-card-text>
    </v-card>

    <v-alert
      v-if="errorMsg"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ errorMsg }}
    </v-alert>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="rounded-lg" border>
          <v-card-title class="text-h6">Ticket objetivo</v-card-title>
          <v-card-text class="d-flex flex-column ga-4">
            <v-text-field
              v-model="redmineId"
              label="Redmine ID"
              type="number"
              prepend-inner-icon="mdi-pound"
              :disabled="analyzing || assisting"
              @keyup.enter="analyze()"
            />

            <v-btn
              color="primary"
              prepend-icon="mdi-robot"
              :loading="analyzing"
              :disabled="!canAnalyze"
              block
              @click="analyze()"
            >
              Analizar ticket
            </v-btn>

            <v-btn
              variant="tonal"
              prepend-icon="mdi-refresh"
              :loading="analyzing"
              :disabled="!canReanalyzeCurrentDescription"
              block
              @click="analyzeEditedDescription"
            >
              Reanalizar descripción editada
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card class="rounded-lg mt-4" border>
          <v-card-title class="text-h6">Pedido de asistencia</v-card-title>
          <v-card-text class="d-flex flex-column ga-4">
            <v-textarea
              v-model="userInput"
              label="Instrucciones o respuestas para la IA"
              rows="7"
              auto-grow
              :disabled="!analysis || assisting || analyzing"
              hint="Ejemplo: enfatizar criterios de aceptación, responder dudas previas o pedir una versión más breve."
              persistent-hint
            />

            <v-btn
              color="secondary"
              prepend-icon="mdi-auto-fix"
              :loading="assisting"
              :disabled="!canAssist"
              block
              @click="assist"
            >
              Mejorar con IA
            </v-btn>

            <v-alert
              v-if="okMsg"
              type="success"
              variant="tonal"
              density="compact"
              class="assist-success"
            >
              {{ okMsg }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card v-if="analysis" class="rounded-lg" border>
          <v-tabs
            v-model="activeTab"
            density="comfortable"
            show-arrows
          >
            <v-tab value="analysis" prepend-icon="mdi-chart-timeline-variant">
              Análisis en tiempo real
            </v-tab>
            <v-tab value="proposal" prepend-icon="mdi-text-box-edit-outline">
              Última descripción propuesta
            </v-tab>
            <v-tab value="history" prepend-icon="mdi-history">
              Historial de propuestas
            </v-tab>
          </v-tabs>

          <v-divider />

          <v-window v-model="activeTab">
            <v-window-item value="analysis">
              <RedmineIssueAnalysisView :redmine-issue-analysis="analysis" />
            </v-window-item>

            <v-window-item value="proposal">
              <v-card-text>
                <div class="d-flex align-center justify-end mb-3">
                  <v-btn
                    variant="tonal"
                    prepend-icon="mdi-content-copy"
                    :disabled="!currentDescription"
                    @click="copyDescription"
                  >
                    {{ copied ? 'Copiado' : 'Copiar' }}
                  </v-btn>
                </div>

                <v-btn-toggle
                  v-model="descriptionMode"
                  class="description-mode-toggle mb-3"
                  color="primary"
                  divided
                  mandatory
                  variant="outlined"
                >
                  <v-btn value="editableRaw" prepend-icon="mdi-pencil">
                    Editable raw
                  </v-btn>
                  <v-btn value="readonlyRaw" prepend-icon="mdi-text-box-outline">
                    Readonly raw
                  </v-btn>
                  <v-btn value="readonlyTextile" prepend-icon="mdi-format-text">
                    Readonly textile
                  </v-btn>
                </v-btn-toggle>

                <v-textarea
                  v-if="descriptionMode !== 'readonlyTextile'"
                  v-model="currentDescription"
                  :label="descriptionMode === 'editableRaw' ? 'Descripción editable' : 'Descripción readonly raw'"
                  rows="14"
                  auto-grow
                  :readonly="descriptionMode === 'readonlyRaw'"
                  :disabled="descriptionMode === 'editableRaw' && (assisting || analyzing)"
                />

                <v-sheet
                  v-else
                  class="textile-preview pa-4"
                  border
                  rounded
                >
                  <div
                    v-if="currentDescription"
                    class="textile-content"
                    v-html="renderedDescription"
                  />
                  <div v-else class="text-medium-emphasis">
                    Sin descripción para mostrar.
                  </div>
                </v-sheet>
              </v-card-text>
            </v-window-item>

            <v-window-item value="history">
              <v-card-text>
                <v-expansion-panels
                  v-if="history.length"
                  v-model="historyPanels"
                  multiple
                  variant="accordion"
                >
                  <v-expansion-panel
                    v-for="(item, index) in history"
                    :key="item.id"
                  >
                    <v-expansion-panel-title>
                      Iteración {{ history.length - index }} · {{ formatDate(item.createdAt) }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div class="text-subtitle-2 mb-2">Pedido del usuario</div>
                      <v-sheet class="pa-3 rounded bg-surface-variant mb-4">
                        {{ item.userInput || 'Sin instrucciones adicionales.' }}
                      </v-sheet>

                      <div class="text-subtitle-2 mb-2">Preguntas y comentarios</div>
                      <v-list density="compact" class="mb-4">
                        <v-list-item
                          v-for="comment in item.result.preguntasComentarios"
                          :key="comment"
                        >
                          <template #prepend>
                            <v-icon color="primary">mdi-comment-question-outline</v-icon>
                          </template>
                          <v-list-item-title class="history-comment text-wrap">{{ comment }}</v-list-item-title>
                        </v-list-item>
                      </v-list>

                      <v-textarea
                        v-model="item.editedDescription"
                        label="Descripción propuesta en esta iteración"
                        rows="8"
                        auto-grow
                        readonly
                      />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <div v-else class="empty-tab-state text-center text-medium-emphasis">
                  Todavía no hay propuestas generadas.
                </div>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>

        <v-card v-if="!analysis" class="rounded-lg empty-state" border>
          <v-card-text class="pa-8 text-center">
            <v-icon size="64" color="primary" class="mb-3">mdi-clipboard-search-outline</v-icon>
            <div class="text-h6 font-weight-bold mb-2">Ingresa un Redmine ID para comenzar</div>
            <div class="text-body-2 text-medium-emphasis">
              El análisis no se guarda en base de datos; se usa como contexto vivo para la asistencia IA.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.assist-hero {
  background:
    radial-gradient(circle at top right, rgba(var(--v-theme-primary), 0.12), transparent 28%),
    linear-gradient(135deg, rgba(var(--v-theme-surface), 1), rgba(var(--v-theme-primary), 0.05));
}

.assist-hero-content {
  min-width: 0;
}

.hero-icon {
  flex: 0 0 auto;
  font-size: 34px;
  opacity: 0.75;
}

.assist-success {
  margin-top: -4px;
}

.description-mode-toggle {
  display: inline-flex;
  flex-wrap: wrap;
  height: auto;
  max-width: 100%;
}

.description-mode-toggle :deep(.v-btn) {
  min-width: 0;
  white-space: normal;
}

.textile-preview {
  min-height: 340px;
  background: rgb(var(--v-theme-surface));
}

.textile-content {
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.textile-content :deep(h1),
.textile-content :deep(h2),
.textile-content :deep(h3),
.textile-content :deep(h4),
.textile-content :deep(h5),
.textile-content :deep(h6) {
  margin: 0 0 12px;
  font-weight: 700;
  line-height: 1.25;
}

.textile-content :deep(p),
.textile-content :deep(ul),
.textile-content :deep(ol) {
  margin: 0 0 12px;
}

.textile-content :deep(ul),
.textile-content :deep(ol) {
  padding-left: 24px;
}

.textile-content :deep(code) {
  border-radius: 4px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  padding: 2px 5px;
}

.textile-content :deep(a) {
  color: rgb(var(--v-theme-primary));
}

.history-comment {
  font-size: 0.95rem;
  line-height: 1.5;
}

.empty-state {
  min-height: 360px;
  display: grid;
  place-items: center;
}

.empty-tab-state {
  min-height: 220px;
  display: grid;
  place-items: center;
}
</style>
