<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl'
import { Marker } from "mapbox-gl";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const props = defineProps({
    markers: { 
        type: Array,
        required: false,
    },
    'marker-options': {
        type: Boolean,
        required: true,
        default: true 
    }
})

const geocoder = ref(MapboxGeocoder)
const map = ref(mapboxgl.Map)
const addMarker = ref(false)


const loadMarkers = () => { 
    props.markers.forEach(marker => { 
        createPointer(marker)
    })
}

const initMap = () => { 
        map.value = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/toner-v2/style.json?key=qxYJYciqhDs6S1mBLLEZ', // style URL
    center: [props.markers[0].location.lng, props.markers[0].location.lat],
    zoom: 6,
    accessToken: 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh2dmc4MGl5bzN3bXRsNGRmbDVqOCJ9.egn7CgNwwq8bmEtE1pkXyw'
        });
    initializeGeodecoders()

    if (props.markers && props.markers.length > 0) { 
        loadMarkers()
    }

    map.value.on('contextmenu', (e) => {
        if (addMarker.value) { 
            createPointer(e)   
            addMarker.value = false
            }
        })
}

const initializeGeodecoders = () => { 
    geocoder.value = new MapboxGeocoder({
        accessToken: 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh2dmc4MGl5bzN3bXRsNGRmbDVqOCJ9.egn7CgNwwq8bmEtE1pkXyw',
        mapboxgl: mapboxgl
    });
      
      map.value.addControl(geocoder.value);
}

const createPointer = (event) => { 
    const lng = event?.lngLat?.lng ? event.lngLat.lng : event.location.lng
    const lat = event?.lngLat?.lat ? event.lngLat.lat : event.location.lat
    console.log([lng,lat])
let element = document.createElement('img')
element.id = 'map-pointer'
element.src = 'https://static.vecteezy.com/system/resources/previews/014/488/954/original/location-pin-collection-red-pointer-icon-for-pin-on-the-map-to-show-the-location-png.png'
element.addEventListener('click', () => { 
    map.value.flyTo({
        center: [lng,lat],
        zoom: 12
    })
})
element.className = 'w-8 h-8 object-contain'
    
    const newMarker = new Marker(element).setLngLat([lng,lat])
newMarker.addTo(map.value)
}

const clearPointer = () => { 
    const el = document.getElementById('map-pointer')
    el.remove()
}



onMounted(() => { 
    initMap()
})


onUnmounted(() => {
    map.value.remove()
})

</script>


<template>
      <div class="">
                    <span class="absolute z-40 bg-black text-white rounded" v-if="!markers.length < 1" @click="addMarker = !addMarker">{{ addMarker ? 'Cancel Location' : 'Add Location'}}</span>
                    <span  class="absolute z-40 bg-black text-white rounded" v-else @click="clearPointer">Clear Location</span>
                    <div class="map__gl" id="map" />
        </div>
</template>

<style>
.map__gl {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}
#map-pointer { 
    width: 50px;
    height: 50px;
}
</style>