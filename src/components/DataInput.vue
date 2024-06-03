<template>
  <input
    :placeholder="placeholder"
    v-model="localDate"
    @input="inputHandler"
    @blur="blurOrEnterHandler"
    @keydown.enter="blurOrEnterHandler"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import validateMonth from '@/utils/validate-month'
import validateDay from '@/utils/validate-day'

interface IProps {
  modelValue: string
  defaultLocale?: string
}

const props = withDefaults(defineProps<IProps>(), {
  defaultLocale: 'en-US'
})

const emit = defineEmits<{
  (e: 'update:modelValue', date: string): void
}>()

const locale = ref(props.defaultLocale)
const localDate = ref('')

const placeholder = computed(() => (locale.value === 'en-US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'))

const inputHandler = () => {
  const formattedValue = localDate.value.replace(/[^0-9/]/g, '')
  const dateRegex = /^(\d{1,2})\/?(\d{1,2})?\/?(\d{1,4})?$/
  const match = formattedValue.match(dateRegex)

  if (!match) return

  let [dayOrMonth, monthOrDay, year] = match.slice(1)

  if (locale.value === 'en-US') {
    // Validate and restrict month
    if (dayOrMonth) {
      dayOrMonth = validateMonth(dayOrMonth)
    }

    // Validate days based on the month and year
    if (monthOrDay && parseInt(year) >= 1000) {
      const maxDays = dayjs(`${year}-${dayOrMonth}`).daysInMonth()
      monthOrDay = validateDay(monthOrDay, maxDays)
    }
  }

  if (locale.value === 'en-US') {
    localDate.value = [dayOrMonth, monthOrDay, year].filter(Boolean).join('/')
  } else {
    // Validate and restrict month
    if (monthOrDay) {
      monthOrDay = validateMonth(monthOrDay)
    }

    // Validate days based on the month and year
    if (dayOrMonth && parseInt(year) >= 1000) {
      const maxDays = dayjs(`${year}-${monthOrDay}`).daysInMonth()
      dayOrMonth = validateDay(dayOrMonth, maxDays)
    }

    localDate.value = [dayOrMonth, monthOrDay, year].filter(Boolean).join('/')
  }
}

const blurOrEnterHandler = () => {
  const [firstPart, secondPart, thirdPart] = localDate.value.split('/')
  let date

  date =
    locale.value === 'en-US'
      ? dayjs(`${thirdPart}-${firstPart}-${secondPart}`)
      : dayjs(`${thirdPart}-${secondPart}-${firstPart}`)

  if (date.isValid()) {
    emit('update:modelValue', date.format('YYYY-MM-DD'))
  } else {
    localDate.value = ''
    emit('update:modelValue', '')
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    localDate.value = newValue ? dayjs(newValue).format(locale.value === 'en-US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY') : ''
  },
  { immediate: true }
)

watch(
  () => props.defaultLocale,
  (value) => {
    locale.value = value
  }
)
</script>

<style>
input {
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid hsl(230, 100%, 80%);
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease-in-out;
  box-sizing: border-box;

  &:focus {
    border: 2px solid hsl(230, 100%, 40%);
  }
}
</style>
