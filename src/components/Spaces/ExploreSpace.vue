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
  <form class="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-auto">
    <h2 class="text-xl font-bold mb-4">Book a Parking Space</h2>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2" for="name">
        Name
      </label>
      <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="John Doe">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2" for="email">
        Email
      </label>
      <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="john.doe@example.com">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2" for="phone">
        Phone
      </label>
      <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="tel" placeholder="(123) 456-7890">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2" for="date">
        Date
      </label>
      <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="date">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2" for="time">
        Time
      </label>
      <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time" type="time">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2" for="duration">
        Duration
      </label>
      <select class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="duration">
        <option value="1">1 hour</option>
        <option value="2">2 hours</option>
        <option value="3">3 hours</option>
        <option value="4">4 hours</option>
        <option value="5">5 hours</option>
      </select>
    </div>
    <div class="mb-4">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
        Book Now
      </button>
    </div>
  </form>
</template>
