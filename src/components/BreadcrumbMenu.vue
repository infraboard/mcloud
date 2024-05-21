<template>
  <a-breadcrumb style="margin-bottom: 8px">
    <a-breadcrumb-item v-for="item in breadcrumbRoutes()" :key="item.name">
      {{ item.label }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup>
import { breadcrumbRoutes } from '@/hooks/breadcrumb'
</script>
