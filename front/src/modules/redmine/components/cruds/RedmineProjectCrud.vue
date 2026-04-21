
<script setup lang="ts">
import RedmineProjectCrud from '../../cruds/RedmineProjectCrud'
import {Crud} from "@drax/crud-vue";
import RedmineRemoteProjectCombobox from "@/modules/redmine/comboboxes/RedmineRemoteProjectCombobox.vue";

</script>

<template>
  <crud :entity="RedmineProjectCrud.instance">

    <template v-slot:field.redmineId="{modelValue, setValue}">
      <redmine-remote-project-combobox :modelValue="modelValue" @update:modelValue="setValue"/>
    </template>
  </crud>
</template>

<style scoped>

</style>
