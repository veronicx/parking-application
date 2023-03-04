<script setup>
import { RouterView } from 'vue-router'
import TNavigation from './components/TNavigation.vue'
import Footer from './components/Footer.vue'

import { getAuth, onAuthStateChanged,} from 'firebase/auth'
import { onMounted, ref } from 'vue'

const generateUnRegisteredSession = () => {
  const sessionId = localStorage.getItem('sessionId')
  if(!sessionId) {
     const newSession = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId',newSession );
  }
}

const auth = ref({})
onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      auth.value = user
    } else {
      auth.value = {}
      generateUnRegisteredSession()
    }
  })
})

</script>

<template>
  <main class="bg-slate-50 text-slate-900 flex flex-col">
    <TNavigation :auth="auth" />
    <RouterView style="height: 100vh;" :auth="auth" />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

*{
  font-family: 'Roboto', sans-serif;
}

#app {
  background-color: rgb(248 250 252 / var(--tw-bg-opacity)) !important;
}

</style>
