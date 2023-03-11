<script setup>
import { listingStore } from '../../stores/index';
import { validateInput } from '@/helpers/validations';
import { fetchCurrentParkingSpace } from "@/helpers/api";
import { onMounted, ref, defineProps, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router';
import moment from 'moment'
import Modal from '../Modal.vue';


const props = defineProps({
    auth: {
        type: Object,
        required: true
    }
})



const route = useRoute()
const data = ref({})
const newOrder = ref({
    personName: '',
    personPhone: '',
    personEmail: '',
    'order-duration': {
        startAt: '',
        endAt: ''
    },
    'order-privilege': 'standard',
    price: 0,
})

const errorObject = ref({
    name: {
        message: '',
        checked: false,
    },
    lastName: {
        message: '',
        checked: false,
    },
    email: {
        message: '',
        checked: false,
    },
    phone: {
        message: '',
        checked: false,
    },
    order: {
        message: '',
        checked: false,
    },
})

const collection = ref({
    viewed: Date.now(),
    time: 0,
    viewedBy: {},
    ordered: false,
})

const startAnalytics = () => {
        collection.value.viewed = Date.now()
        collection.value.viewedBy =  props.auth.uid ? props.auth.uid : {
        incognito: true,
        id: localStorage.getItem('sessionId'),
        }
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

const checkout = (duration) => {

    newOrder.value.price = duration / data.value.orderPricePoints[0].price
    if (duration >= 24) {
            return `${Math.floor(duration / 24)} Day`
    }
    else {
            return `${duration} Hours`
         }
}



const handleInput = (key,value) => {
    const data = validateInput(key,value)
    if(data.key && data.message) {
        errorObject.value[key].message = data.message
    } else {
        errorObject.value[key].message = ''
        errorObject.value[key].checked = false
    }
}

onMounted(async () => {
    const id = route.params.id
    if (listingStore().listing.find(item => item._id === id)) {
        data.value = listingStore().listing.find(item => item._id === id.value)
    }
    else {
        data.value = await fetchCurrentParkingSpace(route.params.id)
    }
    if (data.value.premiumFeatures.analytics) {
        startAnalytics()
    }

})
onBeforeUnmount(async () => {
    collection.value.time = Math.abs(Date.now() - collection.value.viewed) / 1000

    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/analytics/view/add`,  {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id.value, view:collection.value})
    })
        .then(response => response.json())
            .then(response => {})
})

const submitOrder = async () => {
    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/order/new`,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'space-id': data.value._id,
            'person-id': props.auth.uid ? props.auth.uid : localStorage.getItem('sessionId'),
            'person-name': newOrder.value.personName,
            'person-email': newOrder.value.personEmail,
            'person-phone': newOrder.value.personPhone,
            'order-duration': {
                'startAt': moment(newOrder.value['order-duration'].startAt).toDate(),
                'endAt': moment(newOrder.value['order-duration'].endAt).toDate(),
                'completed': false
            },
            'order-price': newOrder.value.price,
            'order-privilege': newOrder.value['order-privilege'],
            'ordered-at': Date.now(),
            'org': 'localhost:3000'
            })
        })
            .then(response => response.json())
                .then(data => {
                    if(data) {
                        modalToggler.value = true
                        qrCode.value = data['qr-code']
                        collection.value.ordered = true
                    }
                })

}

</script>

<template>
  <div class="bg-gray-50 px-4 py-8 sm:px-6 md:px-8 lg:px-10">
    <div class="max-w-md mx-auto shadow-lg p-4 rounded-lg">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Parking Reservation</h2>
      <form class="grid grid-cols-1 gap-6">
        <div>
          <label for="name" class="block text-gray-700 font-medium mb-2">Name</label>
          <input type="text" id="name" name="name" placeholder="John Doe" class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" id="email" name="email" placeholder="johndoe@example.com" class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label for="phone" class="block text-gray-700 font-medium mb-2">Phone</label>
          <input type="tel" id="phone" name="phone" placeholder="(123) 456-7890" class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label for="license_plate" class="block text-gray-700 font-medium mb-2">License Plate</label>
          <input type="text" id="license_plate" name="license_plate" placeholder="ABC123" class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label for="date_time" class="block text-gray-700 font-medium mb-2">Date & Time</label>
          <input type="datetime-local" id="date_time" name="date_time" class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label for="duration" class="block text-gray-700 font-medium mb-2">Duration (hours)</label>
          <input type="number" id="duration" name="duration" placeholder="2" min="1" max="24" class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div class="flex justify-center flex-wrap items-center sm:flex-row">
          <button type="button" class="bg-gray-300 m-2 w-fit  text-gray-700 rounded-md px-4 py-2 mr-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Cancel</button>
          <button type="submit" class="bg-gray-300 m-2 w-fit text-gray-700 rounded-md px-4 py-2 mr-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>
