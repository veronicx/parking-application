<script setup>
import { defineComponent, ref } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
defineComponent({
  Navigation,
  RouterView
})
const items = ref([
  {
    id: 1,
    parkingSpot: 1
  },
  {
    id: 2,
    parkingSpot: 2
  },
  {
    id: 3,
    parkingSpot: 3
  }
])

const addItem = ref(() => {
  items.value.push({id: items.value.length + 1, parkingSpot: items.value.length  + 1})
})
</script>

<template>
  <main class="bg-slate-50 text-slate-900">
    <Navigation/>
    <RouterView />
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

*{
  font-family: 'Roboto', sans-serif;
  --tw-bg-opacity: 1;
    background-color: rgb(248 250 252 / var(--tw-bg-opacity));
}
body{
  --tw-bg-opacity: 1;
    background-color: rgb(248 250 252 / var(--tw-bg-opacity));
}
</style>
