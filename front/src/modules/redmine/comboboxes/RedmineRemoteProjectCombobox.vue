<script setup lang="ts">
import type {IRedmineProjectOption} from "../interfaces/IRedmineSync";
import RedmineIssueProvider from "../providers/RedmineIssueProvider";
import {computed, onMounted, ref} from "vue";
import type {PropType} from "vue";

type RedmineRemoteProjectValue =
  | number
  | string
  | IRedmineProjectOption
  | Array<number | string>
  | IRedmineProjectOption[]
  | null
  | undefined;

const model = defineModel<RedmineRemoteProjectValue>();

const props = defineProps({
  label: {type: String, default: "Proyectos"},
  multiple: {type: Boolean, default: false},
  returnObject: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  readonly: {type: Boolean, default: false},
  clearable: {type: Boolean, default: true},
  chips: {type: Boolean, default: true},
  closableChips: {type: Boolean, default: true},
  hint: {type: String as PropType<string | undefined>, default: undefined},
  persistentHint: {type: Boolean, default: false},
  hideDetails: {type: Boolean, default: false},
  density: {
    type: String as PropType<"comfortable" | "compact" | "default">,
    default: "default",
  },
  variant: {
    type: String as PropType<"underlined" | "outlined" | "filled" | "solo" | "solo-inverted" | "solo-filled" | "plain">,
    default: "filled",
  },
});

const provider = RedmineIssueProvider.instance;
const projects = ref<IRedmineProjectOption[]>([]);
const loadingProjects = ref(false);

const isDisabled = computed(() => props.disabled || loadingProjects.value);

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

onMounted(async () => {
  await loadProjects();
});
</script>

<template>
  <v-combobox
    v-model="model"
    :items="projects"
    item-title="name"
    item-value="id"
    :label="label"
    :multiple="multiple"
    :return-object="returnObject"
    :loading="loadingProjects"
    :disabled="isDisabled"
    :readonly="readonly"
    :clearable="clearable"
    :chips="chips && multiple"
    :closable-chips="closableChips && multiple"
    :hint="hint"
    :persistent-hint="persistentHint"
    :hide-details="hideDetails"
    :density="density"
    :variant="variant"
  />
</template>
