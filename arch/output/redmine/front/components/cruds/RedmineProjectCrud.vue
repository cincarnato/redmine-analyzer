
<script setup lang="ts">
import RedmineProjectCrud from '../../cruds/RedmineProjectCrud'
import {Crud} from "@drax/crud-vue";

</script>

<template>
  <crud :entity="RedmineProjectCrud.instance">

  </crud>
</template>

<style scoped>

</style>
