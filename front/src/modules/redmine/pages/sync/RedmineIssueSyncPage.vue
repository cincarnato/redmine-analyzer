<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import RedmineIssueProvider from '../../providers/RedmineIssueProvider'
import type {
  IRedmineIssueSyncResult,
  IRedmineProjectOption,
  IRedmineStatusOption,
  RedmineIssueSyncDateField
} from '../../interfaces/IRedmineSync'

const provider = RedmineIssueProvider.instance

const loadingProjects = ref(false)
const loadingStatuses = ref(false)
const syncing = ref(false)
const projects = ref<IRedmineProjectOption[]>([])
const statuses = ref<IRedmineStatusOption[]>([])
const projectId = ref<number | string | null>(null)
const dateFrom = ref<string>('')
const dateTo = ref<string>('')
const dateField = ref<RedmineIssueSyncDateField>('closed_on')
const statusIds = ref<Array<number | string>>([])
const includeJournals = ref(false)
const errorMsg = ref<string | null>(null)
const okMsg = ref<string | null>(null)
const result = ref<IRedmineIssueSyncResult | null>(null)
const dateFieldOptions: Array<{title: string; value: RedmineIssueSyncDateField}> = [
  {title: 'Fecha de cierre', value: 'closed_on'},
  {title: 'Fecha de creación', value: 'created_on'}
]

const canSubmit = computed(() => {
  return !!projectId.value && !!dateFrom.value && !!dateTo.value && !syncing.value
})

async function loadProjects() {
  loadingProjects.value = true
  errorMsg.value = null

  try {
    projects.value = await provider.fetchProjects()
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
    statuses.value = await provider.fetchStatuses()
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

  syncing.value = true
  errorMsg.value = null
  okMsg.value = null
  result.value = null

  try {
    result.value = await provider.syncIssues({
      projectId: projectId.value as string | number,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      dateField: dateField.value,
      statusIds: statusIds.value,
      includeJournals: includeJournals.value
    })
    okMsg.value = `Sincronización completada. Total: ${result.value.total}, creados: ${result.value.created}, actualizados: ${result.value.updated}`
  } catch (e: any) {
    console.error('Error syncing Redmine issues:', e)
    errorMsg.value = e?.message ?? 'No se pudo sincronizar la información de Redmine'
  } finally {
    syncing.value = false
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
        Sincronizar tickets de Redmine
      </v-card-title>

      <v-card-text class="d-flex flex-column ga-4">
        <div class="text-medium-emphasis">
          Selecciona un proyecto, el tipo de fecha a filtrar, los estados a incluir y un rango para copiar los tickets desde Redmine al modelo local.
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
              label="Proyecto"
              :loading="loadingProjects"
              :disabled="loadingProjects || syncing"
              clearable
            />
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="dateField"
              :items="dateFieldOptions"
              item-title="title"
              item-value="value"
              label="Filtrar por"
              :disabled="syncing"
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
              :disabled="loadingStatuses || syncing"
              multiple
              chips
              closable-chips
              clearable
              hint="Si no seleccionas estados, se sincronizan todos"
              persistent-hint
            />
          </v-col>

          <v-col cols="12">
            <v-switch
              v-model="includeJournals"
              label="Incluir journals"
              :disabled="syncing"
              color="primary"
              hint="Si está activo, se consultará cada issue por separado para obtener sus journals"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="dateFrom"
              type="date"
              label="Fecha desde"
              :disabled="syncing"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="dateTo"
              type="date"
              label="Fecha hasta"
              :disabled="syncing"
            />
          </v-col>
        </v-row>

        <div class="d-flex ga-3">
          <v-btn
            color="primary"
            prepend-icon="mdi-sync"
            :loading="syncing"
            :disabled="!canSubmit"
            @click="submit"
          >
            Sincronizar
          </v-btn>

          <v-btn
            variant="text"
            :disabled="loadingProjects || loadingStatuses || syncing"
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

          <v-card-text>
            <div>Proyecto: {{ result.projectId }}</div>
            <div>Rango: {{ result.dateFrom }} a {{ result.dateTo }}</div>
            <div>Estados: {{ result.statusIds?.length ? result.statusIds.join(', ') : 'Todos' }}</div>
            <div>Journals: {{ result.includeJournals ? 'Sí' : 'No' }}</div>
            <div>Total procesados: {{ result.total }}</div>
            <div>Creados: {{ result.created }}</div>
            <div>Actualizados: {{ result.updated }}</div>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>
