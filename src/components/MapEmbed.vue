<script setup>
import {onBeforeMount, onMounted, onUnmounted, ref, reactive, watch} from 'vue';
import mapboxgl from 'mapbox-gl'
import { Marker } from "mapbox-gl";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

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
const zoomLevel = ref(8)
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

    if (props.markers && props.markers.length > 0) {
        loadMarkers()
    }

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
  emits('zoom', map.getZoom())
})


onUnmounted(() => {
    map.remove()
})

watch(() => map, (newVal,oldVal) => {
  if(newVal.getZoom()) {
    emits('zoom', newVal.getZoom())
  }
}, { deep: true})
</script>


<template>
  <div class="flex flex-row">
    <slot name="sidelist" :map="map" />
    <div
      id="map"
      class="map__gl"
      @scroll="emits('zoom',map.getZoom())"
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
</style>
