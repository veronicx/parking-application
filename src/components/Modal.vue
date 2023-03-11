<script setup>
defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: false,
        default: 'Modal'
    }
})
defineEmits(['close','submit'])

</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex flex-row items-center"
  >
    <div
      class="absolute inset-0 bg-slate-900 opacity-75"
      @click="$emit('close')"
    />
    <div class="relative z-50 w-full flex flex-row justify-center items-center">
      <div class="bg-slate-50 w-1/3 flex flex-col rounded-lg">
        <div
          v-if="!$attrs['hide-header']"
          id="header"
          class="bg-blue-300 rounded-t-lg text-center flex flex-row items-center justify-between h-12"
        >
          <h3 class="text-xl">
            {{ title }}
          </h3>
          <button class="rounded-full bg-slate-900 text-white pl-1 pr-1 m-2 text-sm">
            X
          </button>
        </div>
        <slot />
        <div
          v-if="!$attrs['hide-footer']"
          id="footer"
          class="flex flex-row justify-end h-12 mt-4 bg-blue-300 rounded-b-lg"
        >
          <button
            class="bg-black h-5/6 text-white rounded mr-4 mt-1"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            class="bg-green-200 h-5/6 text-black rounded mr-4 mt-1"
            @click="$emit('submit')"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>