<script setup>
import { listingStore } from '../../stores/index';
import {  onMounted, ref, defineProps, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router';

const props = defineProps({
    auth: { 
        type: Object,
        required: true
    }
})



const route = useRoute()
const data = ref({})
const id = ref('')


function generateID() {
  var id = "random-";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return id;
}

const collection = ref({ 
    viewed: Date.now(),
    time: 0,
    viewedBy: {},
    ordered: false,
})

const startAnalytics = () => { 
        collection.value.viewed = Date.now()
        collection.value.viewedBy =  props.auth.uid ? props.auth.uid : {  
        random: true,
        id: generateID(),
        }
}



onMounted(async () => { 
     id.value = route.params.id
    if (listingStore().listing.find(item => item._id === id.value)) {
        data.value = listingStore().listing.find(item => item._id === id.value)
    }
    else { 
        await fetch(`http://localhost:3000/one/${route.params.id}`)
            .then(response => response.json())
                    .then(response => data.value = response)
    }
    if (data.value.premiumFeatures.analytics) { 
        startAnalytics()   
    }

})

onBeforeUnmount(async () => { 
    collection.value.time = Math.abs(Date.now() - collection.value.viewed) / 1000

    await fetch('http://localhost:3000/analytics/view/add',  { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id.value, view:collection.value})
    })
        .then(response => response.json())
            .then(response => console.log('RESPONSE', response))
} )

</script> 

<template>
    <div>
        user space {{ collection }}
    </div>
</template>