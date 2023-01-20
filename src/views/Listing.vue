<script setup>
import { onMounted, ref } from 'vue'

import router from '../router'

import { listingStore } from '../stores';

const listing = ref([])

onMounted(async () => {
    if (listingStore().listing.length < 1) {
        await fetch('http://localhost:3000/spaces/listing')
            .then(response => response.json())
            .then(data => {
                listing.value = data
                listingStore().updateList(data)
            })
    } else { 
        listing.value = listingStore().listing
    }
})

</script> 

<template>
    <div class="flex flex-col justify-between h-100 w-100">
        <div v-for="list in listing" :key="list._id" class="h-12 w-3/5 m-4 rounded-sm bg-blue-200" @click="router.push(`/space/current/${list._id}`)">
                {{ list.title }}
        </div>
    </div>
</template>