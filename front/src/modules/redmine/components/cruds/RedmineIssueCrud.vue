
<script setup lang="ts">
import RedmineIssueCrud from '../../cruds/RedmineIssueCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"
import RedmineIssueView from "@/modules/redmine/components/RedmineIssueView.vue";

</script>

<template>
  <crud :entity="RedmineIssueCrud.instance">
    <template v-slot:item.startDate="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.dueDate="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.createdOn="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.updatedOn="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.closedOn="{value}">{{formatDate(value)}}</template>

    <template v-slot:form="{form, operation}">
      <redmine-issue-view v-if="operation === 'view'" :redmine-issue="form"></redmine-issue-view>
    </template>

  </crud>
</template>

<style scoped>

</style>

