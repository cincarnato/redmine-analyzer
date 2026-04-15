
<script setup lang="ts">
import RedmineIssueAnalysisCrud from '../../cruds/RedmineIssueAnalysisCrud'
import {Crud} from "@drax/crud-vue";
import RedmineIssueAnalysisView from "@/modules/redmine/components/RedmineIssueAnalysisView.vue";

</script>

<template>
  <crud :entity="RedmineIssueAnalysisCrud.instance">
    <template v-slot:item.redmineIssue="{value}">{{value?.subject}}</template>

    <template v-slot:form="{form, operation}">
      <redmine-issue-analysis-view v-if="operation === 'view'" :redmine-issue-analysis="form"></redmine-issue-analysis-view>
    </template>

  </crud>
</template>

<style scoped>

</style>
