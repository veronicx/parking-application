<script setup>
const props = defineProps({
  auth: {
    type: Object,
    required: true,
  }
})
import Profile from '../components/User/Profile.vue';


</script>

<template>
  <div class="flex flex-col items-center">
    <Profile :auth="auth" />
  </div>
</template>
