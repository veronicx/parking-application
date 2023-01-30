<script setup>
import { listingStore } from '../../stores/index';
import { onMounted, ref, defineProps, onBeforeUnmount, computed } from 'vue'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { useRoute } from 'vue-router';
import moment from 'moment'

const props = defineProps({
    auth: { 
        type: Object,
        required: true
    }
})



const inputClass = ref('bg-gray-50 border uppercase border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500')
const route = useRoute()
const data = ref({})
const id = ref('')

const newOrder = ref({ 
    personName: '',
    personPhone: '',
    personEmail: '',
    'order-duration': {
        startAt: '',
        endAt: ''
    },
    price: 0,
})


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
        await fetch(`http://localhost:3000/spaces/one/${route.params.id}`)
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
})


const config = {
        enableTime: true,
        noCalendar: false,
        dateFormat: 'H:i:S d-m-Y',
        minDate: Date.now(),
}

const calculateDuration = computed(() => {

    const startDate = newOrder.value['order-duration'].startAt
    const endDate = newOrder.value['order-duration'].endAt

  const dateFormat = 'HH:mm:ss DD-MM-YYYY';
  const start = moment(startDate, dateFormat);
  const end = moment(endDate, dateFormat);
  const duration = end.diff(start, 'minutes');

  if (duration < 60) {
    return 1;
  }

  const hours = duration / 60;

  const roundedHours = Math.ceil(hours);
  return roundedHours;
})

const checkout = ref((duration) => { 

    newOrder.value.price = duration / data.value.orderPricePoints[0].price
    if (duration >= 24) {
            return `${Math.floor(duration / 24)} Day`
    }
    else { 
            return `${duration} Hours`
         }
})

</script> 

<template>
    <div class="flex flex-col items-center w-full border-2">
        {{ data }}
            <div class="flex flex-col w-3/6  shadow-blue-400 shadow-md text-sm rounded-lg">
                <header class="w-full rounded-t-lg bg-slate-900 p-4 text-2xl tracking-wider text-white"> Order for {{ data.title }}</header>
                <div class="flex flex-row w-full">
                    <img src="../../assets/explore2.jpg" alt="" class="w-3/6 object-contain">
                    <div class="flex flex-col w-3/6">
                        <section class="w-full flex-col justify-start p-4">
                            <span class="text-lg text-slate-400 ml-1">Name</span>
                            <input type="text" placeholder="Name..." :class="inputClass">
                        </section>
                        <section class="w-full flex-col justify-start p-4 mb-2">
                            <span class="text-lg text-slate-400 ml-1">Phone Number</span>
                            <input type="text" placeholder="+383 ...." :class="inputClass">
                        </section>
                        <section class="w-full flex-col justify-start p-4 mb-2">
                            <span class="text-lg text-slate-400 ml-1">Email</span>
                            <input type="text" class="lowercase" placeholder="@..." :class="inputClass">
                        </section>
                        <section class="w-full flex-col justify-center items-center p-4 mb-2">
                            <span class="text-lg text-slate-400 ml-1">Duration</span>
                            <div class="flex flex-row w-full items-center mt-1">
                                <div class="flex flex-col">
                                    <span>Starting Date</span>
                                    <flat-pickr 
                                     v-model="newOrder['order-duration'].startAt"
                                    :config="{config}"
                                     placeholder="Starting Date..."
                                    class="bg-slate-900 w-32 p-4 rounded h-8 mr-2 text-white" />
                                </div>
                                <div class="flex flex-col" v-if="newOrder['order-duration'].startAt">
                                        <span>Ending Date</span>
                                    <flat-pickr 
                                    v-model="newOrder['order-duration'].endAt"
                                    :config="config"
                                     placeholder="Ending Date..."
                                     class="bg-slate-900 p-4 rounded h-8 w-32 text-white" />
                                </div>
                            </div>
                        </section>
                        <div 
                            v-if="newOrder['order-duration'].startAt && newOrder['order-duration'].endAt"
                            class="bg-zinc-200 rounded -mt-1 uppercase text-sm text-center"
                            >
                                Total: {{ checkout(calculateDuration)  }} For {{ newOrder.price}}$
                            </div>
                        <div>
                            <div>
                                <button>Cancel</button>
                                <button>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>