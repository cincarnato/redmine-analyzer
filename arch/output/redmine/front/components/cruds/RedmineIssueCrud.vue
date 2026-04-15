
<script setup lang="ts">
import RedmineIssueCrud from '../../cruds/RedmineIssueCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"

</script>

<template>
  <crud :entity="RedmineIssueCrud.instance">
    <template v-slot:item.startDate="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.dueDate="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.createdOn="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.updatedOn="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.closedOn="{value}">{{formatDate(value)}}</template>
  </crud>
</template>

<style scoped>

</style>

