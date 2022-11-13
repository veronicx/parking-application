import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'



/* import font awesome icon component */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

const app = createApp(App)


app.component('font-awesome-icon', FontAwesomeIcon)
// GOOGLE MAPS

app.use(createPinia())
app.use(router)

app.mount('#app')
