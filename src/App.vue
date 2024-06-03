<template>
  <div class="wrapper">
    <date-input v-model="date" :default-locale="defaultLocale" />
    <p>Selected Date: {{ date }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DateInput from './components/DataInput.vue'

const date = ref('')
const defaultLocale = ref('')

onMounted(() => {
  if (typeof window !== 'undefined') {
    // Code is running on the client
    defaultLocale.value = navigator.language
  } else {
    // Code is not running on the client
    defaultLocale.value = 'en-US'
  }
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  max-width: 500px;
  width: 100%;
}
</style>
