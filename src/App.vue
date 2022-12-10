<script setup>
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
defineComponent({
  Navigation,
  Footer,
  RouterView
})

</script>

<template>
  <main class="bg-slate-50 text-slate-900">
    <Navigation/>
    <RouterView />
    <Footer />
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
