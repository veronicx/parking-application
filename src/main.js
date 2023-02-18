import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import VueSocketIO from 'vue-socket.io'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

/* import font awesome icon component */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASEAPIKEY,
  authDomain: import.meta.env.VITE_FIREBASEAUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASEPROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASESTORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASEMESSENGERID,
  appId: import.meta.env.VITE_FIREBASEAPPID
};
initializeApp(firebaseConfig);

library.add(fas)



const app = createApp(App)

// app.use(new VueSocketIO({
//   connection: 'ws://localhost:8080'
// }))

app.component('font-awesome-icon', FontAwesomeIcon)
// GOOGLE MAPS

app.use(createPinia())
app.use(router)

app.mount('#app')
