<script setup>
import { validateInput } from '@/helpers/validations';
import { fetchCurrentParkingSpace } from "@/helpers/api";
import { onMounted, ref,  onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import MapEmbed from "@/components/MapEmbed.vue";
import moment from 'moment'
import Modal from '../Modal.vue';
import MapPointer from "@/components/MapPointer.vue";

const props = defineProps({
  auth: {
    type: Object,
    required: true,
  }
})

const route = useRoute()
const router = useRouter()
const data = ref({})

const order = ref({
  name: '',
  email: '',
  phone: '',
  license: '',
  dateStart: Date.now(),
  dateEnd: Date.now()
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


const  calculateTimeBetweenDates = computed(() => {
  if(order.value.dateStart && order.value.dateEnd ) {
    const start = new Date(order.value.dateStart)
    const end = new Date(order.value.dateEnd)
    const timeDiff = Math.abs(start - end);
    const hours = timeDiff / 36e5; // 1 hour = 3,600,000 milliseconds = 36e5
      if(hours <= 1) {
        return 1 * data.value.orderPricePoints.hour
      }
      if(hours > 24) {
        const daily = Math.floor(hours / 24)
          return daily * data.value.orderPricePoints.day
      }
      if(hours >= 650) {
        const monthly = Math.floor(hours / 730)
          return monthly * data.value.orderPricePoints.month
      }

  }
  return -1
})





onMounted(async () => {
  await fetchCurrentParkingSpace(route.params.id).then ( response => data.value = response)
    if (data.value.premiumFeatures.analytics) {
        startAnalytics()
    }

})
onBeforeUnmount(async () => {
    collection.value.time = Math.abs(Date.now() - collection.value.viewed) / 1000

    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/analytics/view/add`,  {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: props.auth.uid ? props.auth.uid : localStorage.getItem('sessionId'), view:collection.value})
    })
        .then(response => response.json())
            .then(response => {})
})

const submitOrder = async () => {
  const price = ref(calculateTimeBetweenDates)
    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/order/new`,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'space-id': data.value._id,
            'space-title': data.value.title,
            'person-id': props.auth.uid ? props.auth.uid : localStorage.getItem('sessionId'),
            'person-name': order.value.name,
            'person-email': order.value.email,
            'person-phone': order.value.phone,
            'order-duration': {
                'startAt': moment(order.value.dateStart).toDate(),
                'endAt': moment(order.value.dateEnd).toDate(),
                'completed': false
            },
            'order-price': price.value,
            'order-privilege': 'standard',
            'ordered-at': Date.now(),
            'license-plate': order.value.license,
            'org': 'localhost:5173',
            })
        })
            .then(response => response.json())
                .then(data => {
                    if(data) {
                        // modalToggler.value = true
                        // qrCode.value = data['qr-code']
                        collection.value.ordered = true
                    }
                })

}

const reviews = ref([
])

</script>

<template>
  <div
    v-if="data.location"
    class="flex flex-col items-center sm:items-stretch h-fit sm:flex-row justify-between"
  >
    <div class="flex flex-col w-full sm:w-1/2 p-4 bg-gray-100 rounded-lg h-fit w-fit shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-2 uppercase hover:text-blue-400">
        Parking Space {{ data.title }}
      </h1>
      <h3 class="mb-2 text-gray-600 hover:text-blue-400">
        Available Spaces: {{ data.amount }}
      </h3>
      <p class="text-gray-700 hover:text-blue-400 mb-2">
        Location: {{ data.location.locationName }}, {{ data.location.country }}
      </p>
      <div class="flex flex-col mb-2">
        <h2 class="font-medium hover:text-blue-400">
          Manager: {{ data.createdBy.email }} {{ data.createdBy.displayName }}
        </h2>
      </div>
      <h2 class="text-gray-700 font-medium hover:text-blue-400 mb-2">
        Price per Hour: {{ data?.orderPricePoints[0] || '1$' }}
      </h2>
      <div>
        <MapEmbed :geocoder="false">
          <template #pointers="{map}">
            <MapPointer
              reference="current"
              :pointer="data"
              :map="map"
            />
          </template>
        </MapEmbed>
      </div>
      <div class="mt-4">
        <div v-if="reviews && reviews.length">
          <small>Reviews</small>
          <div
            v-for="review in reviews"
            :key="review"
          >
            <small>{{ review.reviewer }}</small>
            <textarea
              v-model="review.content"
              disabled
            />
          </div>
        </div>
        <div
          v-else
          class="flex flex-col items-center bg-slate-200 p-2 rounded-md"
        >
          <p class="text-sm text-slate-700">
            There's no reviews for this parking location
          </p>
          <small class="hover:text-blue-400 text">Add Review</small>
        </div>
      </div>
      <div />
    </div>
    <div class="w-full sm:w-1/2 bg-gray-50 px-4  sm:px-6 md:px-8 lg:px-10">
      <div class="max-w-md mx-auto shadow-lg p-4 rounded-lg mb-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reserve a Parking Space
        </h2>
        <form class="grid grid-cols-1 gap-6">
          <div>
            <label
              for="name"
              class="block text-gray-700 font-medium mb-2"
            >Name</label>
            <input
              id="name"
              v-model="order.name"
              type="text"
              required
              name="name"
              placeholder="John Doe"
              class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label
              for="email"
              class="block text-gray-700 font-medium mb-2"
            >Email</label>
            <input
              id="email"
              v-model="order.email"
              type="email"
              required
              name="email"
              placeholder="johndoe@example.com"
              class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label
              for="phone"
              class="block text-gray-700 font-medium mb-2"
            >Phone</label>
            <input
              id="phone"
              v-model="order.phone"
              type="tel"
              name="phone"
              required
              placeholder="(123) 456-7890"
              class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label
              for="license_plate"
              class="block text-gray-700 font-medium mb-2"
            >License Plate</label>
            <input
              id="license_plate"
              v-model="order.license"
              type="text"
              required
              name="license_plate"
              placeholder="ABC123"
              class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label
              for="date_time"
              class="block text-gray-700 font-medium mb-2"
            >Date Started</label>
            <input
              id="date_time"
              v-model="order.dateStart"
              type="datetime-local"
              required
              name="date_time"
              class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label
              for="date_time"
              class="block text-gray-700 font-medium mb-2"
            >Date Ending</label>
            <input
              id="date_time"
              v-model="order.dateEnd"
              type="datetime-local"
              name="date_time"
              required
              class="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <small
            v-if="calculateTimeBetweenDates > 0"
            class="bg-green-400 text-center rounded p-2"
          >{{ calculateTimeBetweenDates }}</small>
          <div class="flex justify-center flex-wrap items-center sm:flex-row">
            <button
              type="button"
              class="bg-gray-300 m-2 w-fit  text-gray-700 rounded-md px-4 py-2 mr-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              @click="router.go(-1)"
            >
              Cancel
            </button>
            <button
              type="submit"
              @click.prevent="submitOrder"
              class="bg-gray-300 m-2 w-fit text-gray-700 rounded-md px-4 py-2 mr-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
