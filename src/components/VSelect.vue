<script setup>
//DEPRECATED COMPONENT
import { ref } from 'vue'

defineProps({
    placeholder: {
        type: String
    },
    options: {
        type: Array,
        required: true
    }
})
defineEmits(['input'])

const selectedOption = ref('')

</script>


<template>
  <div class="flex flex-row border-2">
    <span
      v-if="!selectedOption"
      class="absolute mt-2 ml-2 z-10 text-white"
    >{{ placeholder }}</span>
    <select
      id="countries"
      v-model="selectedOption"
      required
      class="bg-gray-50 border uppercase border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      @change="$emit('input', selectedOption)"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>
