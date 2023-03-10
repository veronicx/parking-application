<script setup>
import {onBeforeMount, onMounted, onUnmounted, ref, reactive} from 'vue';
import mapboxgl from 'mapbox-gl'
import { Marker } from "mapbox-gl";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { checkZoomLevel } from "@/helpers/map";

const emits = defineEmits(['zoom'])

const props = defineProps({
    markers: {
        type: Array,
        required: false,
      default: () => [],
    },
    markerOptions: {
        type: Boolean,
        required: true,
        default: true
    }
})

const geocoder = ref(MapboxGeocoder)
let map = mapboxgl.Map
const zoomLevel = ref(7)
const addMarker = ref(false)
const geolocation = reactive({
  latitude: 42.,
  longitude: 21,
})

const initMap = () => {
        map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=qxYJYciqhDs6S1mBLLEZ', // style URL qxYJYciqhDs6S1mBLLEZ
    center: [geolocation.longitude,geolocation.latitude],
    zoom: 7,
    minZoom: 5,
    accessToken: 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh2dmc4MGl5bzN3bXRsNGRmbDVqOCJ9.egn7CgNwwq8bmEtE1pkXyw'
        });
    initializeGeodecoders()

    map.on('contextmenu', (e) => {
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

      map.addControl(geocoder.value);
}


const successCallback = (position) => {
  geolocation.latitude = position.coords.latitude
  geolocation.longitude = position.coords.longitude
};

const errorCallback = (error) => {
  console.log(error);
};


onMounted(() => {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    initMap()

    setInterval(() => {
      const currentLevel = map.getZoom()
        if(checkZoomLevel(zoomLevel.value,currentLevel)) {
          zoomLevel.value = currentLevel
          emits('zoom', zoomLevel.value)
        }
    }, 1200)
})


onUnmounted(() => {
    map.remove()
})


const triggerMe = () => {
  console.log('tickel')
}


 /*
                                                                  NOTES
  // Added Interval Instead of Watcher as Watcher, Because needed to cross-reference the map which would be a huge memory leak
  // This was done for two reasons, the reference was hurting the memory optimization of the application, and second map.getZoom() which is a function cannot be referenced properly
  // This solutiom proved to be the better choice regarding my reasoning
  */


</script>


<template>
  <div
    class="flex flex-row"
    @scroll="triggerMe"
  >
    <slot
      name="sidelist"
      :map="map"
    />
    <div
      id="map"
      class="map__gl"
    />
    <slot
      name="pointers"
      :map="map"
    />
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

.mapboxgl-ctrl-geocoder {
  border: 2px solid white;
  width: 66.5%;
  align-self: flex-start;
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 0 !important;
  padding: 9px !important;
  background-color: #FFFF !important;
}

.mapboxgl-ctrl-geocoder::placeholder  {
  color: red !important;
}

.mapboxgl-ctrl-geocoder--input {
  border: 1px solid lightgray;
  width: 100%;
  border-radius: 8px;
  height: 32px;
  padding-left: 4px;
}

.mapboxgl-ctrl-geocoder--input::placeholder {
  color: lightgray;
  padding-left: 4px;
}

.suggestions-wrapper {
  border: 2px solid red;
  display: block !important;
  position: absolute !important;
  bottom: -13.8rem !important;
  left: 1px;
  background: white;
  border-radius: 8px;
  color: lightgray;
  font-family: "JetBrains Mono Thin",serif;
  font-size: 14px;
  letter-spacing: 0.1rem;
}
ul > li:hover { transition: .2s ease-in; color: black;}

.mapboxgl-ctrl-top-right {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0;
  margin: 0;
}
</style>
