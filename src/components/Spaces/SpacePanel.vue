<script setup>

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const panel = ref({})
const route = useRoute()

onMounted(() => { 
  if (route.params.id) { 
    fetch(`http://localhost:3000/space/panel/${route.params.id}`)
      .then(response => response.json())
        .then(data =>  panel.value = data)
    }
})
</script>


<template>
    <div>
        {{ panel }}
    </div>
</template>

