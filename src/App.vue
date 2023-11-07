<script setup lang="ts">
import Login from './components/LoginAdmin.vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import Dashboard from './components/DashboardAdmin.vue'

const cookies = useCookies(['auth'])
</script>

<template>
  <template v-if="cookies.get('auth')">
    <Dashboard />
  </template>
  <template v-else>
    <Login />
  </template>
</template>
