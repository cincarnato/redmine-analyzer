<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import RedmineIssueProvider from '../../providers/RedmineIssueProvider'
import RedmineIssueAnalysisProvider from '../../providers/RedmineIssueAnalysisProvider'
import type {IRedmineProjectOption, IRedmineStatusOption} from '../../interfaces/IRedmineSync'
import type {
  IRedmineIssueAnalysisRunResult
} from '../../interfaces/IRedmineIssueAnalysisRun'

const issueProvider = RedmineIssueProvider.instance
const analysisProvider = RedmineIssueAnalysisProvider.instance

const loadingProjects = ref(false)
const loadingStatuses = ref(false)
const analyzing = ref(false)
const projects = ref<IRedmineProjectOption[]>([])
const statuses = ref<IRedmineStatusOption[]>([])
const projectId = ref<number | string | null>(null)
const dateFrom = ref<string>('')
const dateTo = ref<string>('')
const statusIds = ref<Array<number | string>>([])
const errorMsg = ref<string | null>(null)
const okMsg = ref<string | null>(null)
const result = ref<IRedmineIssueAnalysisRunResult | null>(null)

const canSubmit = computed(() => {
  return !!projectId.value && !!dateFrom.value && !!dateTo.value && !analyzing.value
})

async function loadProjects() {
  loadingProjects.value = true
  errorMsg.value = null

  try {
    projects.value = await issueProvider.fetchProjects()
  } catch (e: any) {
    console.error('Error loading Redmine projects:', e)
    errorMsg.value = e?.message ?? 'No se pudo cargar la lista de proyectos'
  } finally {
    loadingProjects.value = false
  }
}

async function loadStatuses() {
  loadingStatuses.value = true
  errorMsg.value = null

  try {
    statuses.value = await issueProvider.fetchStatuses()
  } catch (e: any) {
    console.error('Error loading Redmine statuses:', e)
    errorMsg.value = e?.message ?? 'No se pudo cargar la lista de estados'
  } finally {
    loadingStatuses.value = false
  }
}

async function reloadCatalogs() {
  await Promise.all([
    loadProjects(),
    loadStatuses()
  ])
}

async function submit() {
  if (!canSubmit.value) {
    return
  }

  if (dateFrom.value > dateTo.value) {
    errorMsg.value = 'La fecha desde no puede ser mayor que la fecha hasta'
    okMsg.value = null
    result.value = null
    return
  }

  analyzing.value = true
  errorMsg.value = null
  okMsg.value = null
  result.value = null

  try {
    result.value = await analysisProvider.analyzeIssues({
      projectId: projectId.value as string | number,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      statusIds: statusIds.value
    })

    okMsg.value = `Análisis completado. Total: ${result.value.total}, creados: ${result.value.created}, actualizados: ${result.value.updated}, fallidos: ${result.value.failed}`
  } catch (e: any) {
    console.error('Error analyzing Redmine issues:', e)
    errorMsg.value = e?.message ?? 'No se pudo ejecutar el análisis de issues'
  } finally {
    analyzing.value = false
  }
}

onMounted(async () => {
  await reloadCatalogs()
})
</script>

<template>
  <v-container class="py-6" max-width="900">
    <v-card>
      <v-card-title class="text-h5">
        Analizar tickets de Redmine
      </v-card-title>

      <v-card-text class="d-flex flex-column ga-4">
        <div class="text-medium-emphasis">
          Selecciona un proyecto, un rango de fechas y opcionalmente estados. Se analizarán los RedmineIssues ya sincronizados y se guardará o actualizará su RedmineIssueAnalysis.
        </div>

        <v-alert
          v-if="errorMsg"
          type="error"
          variant="tonal"
        >
          {{ errorMsg }}
        </v-alert>

        <v-alert
          v-if="okMsg"
          type="success"
          variant="tonal"
        >
          {{ okMsg }}
        </v-alert>

        <v-row>
          <v-col cols="12">
            <v-combobox
              v-model="projectId"
              :items="projects"
              item-title="name"
              item-value="id"
              :return-object="false"
              label="Proyecto"
              :loading="loadingProjects"
              :disabled="loadingProjects || analyzing"
              clearable
            />
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="statusIds"
              :items="statuses"
              item-title="name"
              item-value="id"
              label="Estados"
              :loading="loadingStatuses"
              :disabled="loadingStatuses || analyzing"
              multiple
              chips
              closable-chips
              clearable
              hint="Si no seleccionas estados, se analizan todos los estados del proyecto y rango indicados"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="dateFrom"
              type="date"
              label="Fecha desde"
              :disabled="analyzing"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="dateTo"
              type="date"
              label="Fecha hasta"
              :disabled="analyzing"
            />
          </v-col>
        </v-row>

        <div class="d-flex ga-3">
          <v-btn
            color="primary"
            prepend-icon="mdi-robot"
            :loading="analyzing"
            :disabled="!canSubmit"
            @click="submit"
          >
            Analizar y guardar
          </v-btn>

          <v-btn
            variant="text"
            :disabled="loadingProjects || loadingStatuses || analyzing"
            @click="reloadCatalogs"
          >
            Recargar catálogos
          </v-btn>
        </div>

        <v-card
          v-if="result"
          variant="outlined"
        >
          <v-card-title class="text-subtitle-1">
            Resultado
          </v-card-title>

          <v-card-text class="d-flex flex-column ga-2">
            <div>Proyecto: {{ result.projectId }}</div>
            <div>Rango: {{ result.dateFrom }} a {{ result.dateTo }}</div>
            <div>Estados: {{ result.statusIds?.length ? result.statusIds.join(', ') : 'Todos' }}</div>
            <div>Total procesados: {{ result.total }}</div>
            <div>Creados: {{ result.created }}</div>
            <div>Actualizados: {{ result.updated }}</div>
            <div>Fallidos: {{ result.failed }}</div>

            <v-alert
              v-if="result.errors.length"
              type="warning"
              variant="tonal"
            >
              Algunos issues no pudieron analizarse.
            </v-alert>

            <v-table
              v-if="result.errors.length"
              density="compact"
            >
              <thead>
              <tr>
                <th>Issue</th>
                <th>Mensaje</th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="item in result.errors"
                :key="item.redmineIssueId"
              >
                <td>{{ item.subject }}</td>
                <td>{{ item.message }}</td>
              </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>
