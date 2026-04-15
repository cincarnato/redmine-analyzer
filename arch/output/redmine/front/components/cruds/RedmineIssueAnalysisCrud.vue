
<script setup lang="ts">
import RedmineIssueAnalysisCrud from '../../cruds/RedmineIssueAnalysisCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"

</script>

<template>
  <crud :entity="RedmineIssueAnalysisCrud.instance">
    <template v-slot:item.redmineIssue="{value}">{{value?.subject}}</template>
  </crud>
</template>

<style scoped>

</style>

