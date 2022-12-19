import { ref,} from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('counter', () => {
 
  const loggedState = ref(false)
  const user = ref({})
  return { loggedState, user }
})
