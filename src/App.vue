<script setup>
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import { getAuth, onAuthStateChanged,} from 'firebase/auth'
import { onMounted, ref } from 'vue'

const isLoggedIn = ref(false)
onMounted(() => { 
  onAuthStateChanged(getAuth(), (user) => { 
    if (user) {
      console.log('user',user)
      isLoggedIn.value = true
    } else { 
      isLoggedIn.value = false
    }
  })
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
