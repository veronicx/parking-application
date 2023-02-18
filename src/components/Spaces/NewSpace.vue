<script setup>
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import { Marker } from "mapbox-gl";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import Modal from '../Modal.vue';
import VSelect from '../VSelect.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
    auth: {
        type: Object,
        required: true,
     }
})



const map = ref(mapboxgl.Map)

const newSpace = ref({
    title: '',
    amount: 0,
    location: {},
    createdBy: null,
    createdAt: Date.now(),
    pricePoints: [],
    premiumFeatures: {
        analytics: false,
        messaging: false,
        'real-time': false,
    }
})

const geocoder = ref(MapboxGeocoder)

const addMarker = ref(false)



const initMap = () => {
        map.value = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/toner-v2/style.json?key=qxYJYciqhDs6S1mBLLEZ', // style URL
    center: [-74.5, 40],
            zoom: 9,
            accessToken: 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh2dmc4MGl5bzN3bXRsNGRmbDVqOCJ9.egn7CgNwwq8bmEtE1pkXyw'
        });
    initializeGeodecoders()

    map.value.on('contextmenu', (e) => {
        if (addMarker.value) {
            createPointer(e)
            addMarker.value = false
            }
        })
}

const createPointer = (event) => {

    let element = document.createElement('img')
    element.id = 'map-pointer'
    element.src = 'http://cdn.onlinewebfonts.com/svg/img_425330.png'
    element.addEventListener('click', () => {
        map.value.flyTo({
            center: [event.lngLat.lng, event.lngLat.lat],
            zoom: 12
        })
    })
    element.className = 'w-8 h-8 object-contain'

    const newMarker = new Marker(element).setLngLat([event.lngLat.lng, event.lngLat.lat])
    newMarker.addTo(map.value)
    newSpace.value.location = {
         lng: event.lngLat.lng,  lat:event.lngLat.lat
        }
}

const clearPointer = () => {
    const el = document.getElementById('map-pointer')
    el.remove()
    newSpace.value.location = {}
}

const initializeGeodecoders = () => {
    geocoder.value = new MapboxGeocoder({
        accessToken: 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh2dmc4MGl5bzN3bXRsNGRmbDVqOCJ9.egn7CgNwwq8bmEtE1pkXyw',
        mapboxgl: mapboxgl
    });

      map.value.addControl(geocoder.value);
}

onMounted(() => {
    if (props.auth && props.auth.uid) {
        newSpace.value.createdBy = {uid:props.auth.uid, email: props.auth.email, displayName: props.auth.providerData[0].displayName}
    }
    initMap()
})

async function getAddressFromCoords() {
      const lng = newSpace.value.location.lng;
      const lat = newSpace.value.location.lat;
      const accessToken = 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh2dmc4MGl5bzN3bXRsNGRmbDVqOCJ9.egn7CgNwwq8bmEtE1pkXyw';
      const endpoint = 'mapbox.places';
      const limit = 1;
      const url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${lng},${lat}.json?access_token=${accessToken}&limit=${limit}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features.length > 0) {
          newSpace.value.location.locationName = data.features[0].place_name;
        } else {
           newSpace.value.location.locationName = 'No address found';
        }
      } catch (error) {
        console.error(error);
      }
     }

const addSpace = async () => {

    await getAddressFromCoords()

    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/spaces/add`,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpace.value)
        })
        .then(response => response.json())
        .then(data => {
            newSpace.value = data
        })
        if (newSpace.value.premiumFeatures.analytics) {
        await fetch(`${import.meta.env.VITE_PARKLACEAPI}/analytics/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newSpace.value._id,
                amount: newSpace.value.amount,
                views: []
                })
            })
    }

    console.log('TEST')
    if (newSpace.value._id) {
     await  router.push(`/space/panel/${newSpace.value._id}`)
    }
}

const pricePointStatus = ref(false)

const randomId = ref(0)

const newPricePoint = ref({
    id: randomId.value,
    type: '',
    price: 0,
})

const handleSubmit = () => {
    pricePointStatus.value = false
    newSpace.value.pricePoints.push(newPricePoint.value)
    newPricePoint.value = {
        id:randomId.value += 1,
        type: '',
        price: 0,
    }
}

const removePricePoint = ref((id) => {
    const filtered = newSpace.value.pricePoints.filter(item => item.id !== id)

    newSpace.value.pricePoints = filtered

})

</script>

<template>
  <div class="flex flex-col bg-slate-50 w-full items-center justify-between shadow-md ml-1 mr-1 p-4">
    <div class="items-center w-2/6 p-4 shadow-blue-400 shadow-lg">
      <div class="mb-6">
        <label
          for="large-input"
          class="block mb-2  font-medium text-slate-900 mt-4 uppercase text-xl"
        >Parking Name</label>
        <input
          id="large-input"
          v-model="newSpace.title"
          type="text"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
      </div>
      <div class="mb-6">
        <label
          for="large-input"
          class="block mb-2  font-medium text-slate-900 mt-4 uppercase text-xl"
        >Parking Space</label>
        <input
          id="large-input"
          v-model="newSpace.amount"
          type="number"
          min="1"
          max="250"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
      </div>
      <h3 class="text-slate-500 text-xl">
        Price Points
      </h3>
      <div class="mb-2">
        <div v-if="newSpace.pricePoints && newSpace.pricePoints.length > 0">
          <div
            v-for="(pricePoint,idx) in newSpace.pricePoints"
            :key="pricePoint.type + idx"
            class="bg-slate-50 w-2/3 flex justify-between  p-2 rounded mb-2"
          >
            <span class="lowercase mr-1">{{ pricePoint.price }}$ per {{ pricePoint.type }}</span>
            <div>
              <button
                class="bg-red-400 text-white rounded-full p-0 w-6 mr-2"
                @click.passive="removePricePoint(pricePoint.id)"
              >
                -
              </button>
              <button
                v-if="idx === newSpace.pricePoints.length - 1"
                class="bg-slate-800 text-white rounded-full p-0 w-6"
                @click="pricePointStatus = !pricePointStatus"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <button
            class="bg-slate-800 text-white rounded-md text-sm"
            @click="pricePointStatus = !pricePointStatus"
          >
            Create Price Point
          </button>
        </div>
      </div>
      <h3 class="text-slate-500">
        Premium Features
      </h3>
      <div class="flex flex-row justify-between">
        <label
          v-for="(feature,key,index) in newSpace.premiumFeatures"
          :key="key +index"
          class="relative inline-flex items-center cursor-pointer"
        >
          <input
            v-model="newSpace.premiumFeatures[key]"
            type="checkbox"
            value="true"
            class="sr-only peer"
          >
          <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
          <span class="ml-3 text-sm font-medium text-slate-900 uppercase">{{ key }}</span>
        </label>
      </div>
      <div class="flex flex-col w-full justify-center items-center shadow-lg p-4">
        <h3 class="text-slate-500 text-4xl">
          Location
        </h3>
        <div class="">
          <span
            v-if="!newSpace.location.lng"
            class="absolute z-40 bg-black text-white rounded"
            @click="addMarker = !addMarker"
          >{{ addMarker ? 'Cancel Location' : 'Add Location' }}</span>
          <span
            v-else
            class="absolute z-40 bg-black text-white rounded"
            @click="clearPointer"
          >Clear Location</span>
          <div
            id="map"
            class="map__gl border-2 w-4/6"
          />
        </div>
        <div class="flex flex-row justify-end">
          <button class="w-16 h-12 bg-black text-white rounded-lg m-2">
            Cancel
          </button>
          <button
            class="w-16 h-12 bg-green-400 text-white rounded-lg m-2"
            @click="addSpace"
          >
            Submit
          </button>
        </div>
      </div>
      <div />
    </div>
    <Modal
      :open="pricePointStatus"
      @close="pricePointStatus = false"
      @submit="handleSubmit()"
    >
      <div class="bg-slate-50 p-4">
        <section>
          <label
            for="countries"
            class="block mb-2 text-sm font-medium text-blac"
          >Select an option</label>
          <VSelect
            class="mb-2"
            :options="['hour']"
            placeholder="add price point"
            @input="(e) => newPricePoint.type = e"
          />
          <input
            v-model="newPricePoint.price"
            type="number"
            min="0"
            placeholder="Amount..."
            class="bg-gray-50 border uppercase border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
        </section>
      </div>
    </Modal>
  </div>
</template>

<style>
.map__gl {
    height: 400px;
    width: 100%;
    min-width: 60vh;
    border-radius: 5px;
}

#modal {
    position: absolute;
    height: 100%;
    margin-bottom: 80px;
}
</style>
