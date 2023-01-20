import { defineStore } from 'pinia'
import {ref} from 'vue'

export const listingStore = defineStore('listing', () => {

  const listing = ref([])

 const updateList = (newVal) => { 
      listing.value = newVal
  }
  
  return { listing, updateList}
  
})
