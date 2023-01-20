<script setup>
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import { Marker } from "mapbox-gl";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
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
    premiumFeatures: { 
        analytics: false,
        smartId: false,
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

const addSpace = async () => { 
   
    await fetch('http://localhost:3000/spaces/add',
        { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpace.value)
        })
        .then(response => response.json())
        .then(data => {
            console.log('DATA', data)
        })
}

</script>

<template>
    <div class="flex flex-row bg-slate-200 w-full justify-between shadow-md ml-1 mr-1">

            <div class="items-center w-2/6">
                <div class="mb-6">
                    <label for="large-input" class="block mb-2  font-medium text-slate-900 mt-4 uppercase text-2xl">Name</label>
                    <input type="text" v-model="newSpace.title" id="large-input" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="mb-6">
                    <label for="large-input" class="block mb-2  font-medium text-slate-900 mt-4 uppercase text-2xl">Parking Space</label>
                    <input type="number" min="1" max="250" v-model="newSpace.amount" id="large-input" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <h3>Premium Features</h3>
                <div class="flex flex-row justify-between">
                    <label v-for="(feature,key,index) in newSpace.premiumFeatures" :key="key +index" class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="newSpace.premiumFeatures[key]" value="true" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span class="ml-3 text-sm font-medium text-slate-900 uppercase">{{ key }}</span>
                    </label>
                </div>
            </div>
            <div class="flex flex-col m-4 w-4/6">
                <div class="">
                    <span class="absolute z-40 bg-black text-white rounded" v-if="!newSpace.location.lng" @click="addMarker = !addMarker">{{ addMarker ? 'Cancel Location' : 'Add Location'}}</span>
                    <span  class="absolute z-40 bg-black text-white rounded" v-else @click="clearPointer">Clear Location</span>
                    <div class="map__gl" id="map" />
                </div>
                <div class="flex flex-row justify-end">
                    <button class="w-16 h-12 bg-black text-white rounded-lg m-2">Cancel</button>
                    <button class="w-16 h-12 bg-green-400 text-white rounded-lg m-2" @click="addSpace">Submit</button>
                </div>
            </div>
            <div>
            </div>
    </div>
</template>

<style>
.map__gl {
    width: 100%;
    height: 400px;
    border-radius: 5px;
}
</style>