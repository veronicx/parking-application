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
  apiKey: "AIzaSyCvhwDu_ucWSaarKyruClKESs5rNM9cGeU",
  authDomain: "parking-app-367020.firebaseapp.com",
  projectId: "parking-app-367020",
  storageBucket: "parking-app-367020.appspot.com",
  messagingSenderId: "154115529008",
  appId: "1:154115529008:web:2bd070d7172f07b31b10f5"
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
