<script setup>
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'

import { getAuth, onAuthStateChanged,} from 'firebase/auth'
import { onMounted, ref } from 'vue'

const auth = ref({})
onMounted(() => { 
  onAuthStateChanged(getAuth(), (user) => { 
    if (user) {
      auth.value = user
    } else { 
      auth.value = {}
    }
  })
})

</script>

<template>
  <main class="bg-slate-50 text-slate-900 flex flex-col">
    <Navigation :auth="auth"/>
    <RouterView :auth="auth" />
    <Footer />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

*{
  font-family: 'Roboto', sans-serif;
}

</style>
