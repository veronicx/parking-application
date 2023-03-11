<script setup>
defineProps({
    auth: {
        type: Object, 
    }
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>