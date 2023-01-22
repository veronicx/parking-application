<script setup>

import { ref, defineProps, defineAsyncComponent, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import moment from 'moment'

const AsyncComp = defineAsyncComponent(() => import('../MapEmbed.vue'))


const props = defineProps({ 
    auth: { 
        type: Object,
        required: true,
     }
})

const panel = ref(null)
const route = useRoute()
const address = ref(null)


onMounted( async() => { 
  if (route.params.id) { 
    await fetch(`http://localhost:3000/space/panel/${route.params.id}`)
      .then(response => response.json())
        .then(data =>  panel.value = data)
  }
  // await getAddressFromCoords()
})

const generateTime = () => { 
  let collection = 0
  if (panel.value.analytics && panel.value.analytics[0].views && panel.value.analytics[0].views.length > 0) {
    panel.value.analytics[0].views.forEach(item => collection += Number(item.time))
    collection = collection / panel.value.analytics[0].views.length
    }
  return `${Math.floor(collection)}s`
}

const generateOrders = () => { 
  let orders = 0
  if (panel.value.analytics && panel.value.analytics[0].views && panel.value.analytics[0].views.length > 0) {
    panel.value.analytics[0].views.forEach(view => {
      if (view.ordered) {
          orders++
        }
    })
  }
    return orders
}

const formatTime = (time) => { 
  return moment(time).format('MMMM Do YYYY')
}

</script>


<template>
    <div class="flex flex-col justify-center w-full" v-if="panel">
        <div class="flex flex-row justify-start p-4 w-full">
            <section class="w-full bg-white shadow-lg flex flex-row justify-between items-center self-start p-4">
              <div class="w-fit bg-white shadow-lg flex flex-row items-center h-16 self-start p-2 mr-6">
                  <img src="../../assets/avatar2.png" class="w-16 h-16 rounded-full" alt="">
                  <span class="text-2xl">{{ panel.space[0].createdBy.email || panel.space[0].createdBy.displayName }}</span>
              </div>
                <div class="flex flex-col mr-6">
                    <span class="text-lg  text-slate-400">Space Title</span>
                    <p class="text-xl">{{ panel.space[0].title }}</p>
                </div>  
                <div class="flex flex-col mr-6">
                    <span class="text-lg  text-slate-400">Space Amount</span>
                    <p class="text-xl">{{ panel.space[0].amount }}</p>
                </div>
                <div class="flex flex-col mr-6">
                    <span class="text-lg  text-slate-400">Space Created</span>
                    <p class="text-xl">{{ formatTime(panel.space[0].createdAt) }}</p>
                </div>   
                <div class="flex flex-col">
                    <span class="text-lg  text-slate-400">Space Location</span>
                    <p class="text-xl">{{ panel.space[0].location.locationName  }}</p>
                </div>  
            </section>
             <!-- <AsyncComp class="w-full h-36 rounded" :markers="panel.space" :marker-options="true" /> -->

        </div>
       <section class="shadow-md m-4 p-4 bg-white">
            <span class="text-2xl  text-slate-400">Analytics on Explore</span>
        <div class="w-full flex flex-row justify-around h-24">
          <div class="bg-white rounded shadow-lg w-fit p-4 h-24">
              <h5 class="text-xl text-slate-500">Total Views</h5>
              <p class="text-4xl"> {{ panel.analytics[0].views.length }}</p>
          </div>
          <div class="bg-white rounded shadow-lg w-fit p-4 h-24">
              <h5 class="text-xl text-slate-500">Average View Time</h5>
              <p class="text-4xl"> {{ generateTime() }}</p>
          </div>
          <div class="bg-white rounded shadow-lg w-fit p-4 h-24">
              <h5 class="text-xl text-slate-500">Order Per View</h5>
              <p class="text-4xl"> {{ generateOrders() }}</p>
          </div>
        </div>
       </section>
    </div>
    <div v-else> No data {{ panel  }}</div>
</template>

