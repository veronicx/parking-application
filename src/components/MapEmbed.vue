<script setup>
import {onBeforeMount, onMounted, onUnmounted, ref, reactive, defineEmits, onBeforeUnmount} from 'vue';
import mapboxgl from 'mapbox-gl'
import { Marker } from "mapbox-gl";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { checkZoomLevel } from "@/helpers/map";

const emits = defineEmits(['zoom', 'pointer'])

const mapContainer = ref(null);
const props = defineProps({
    markers: {
        type: Array,
        required: false,
      default: () => [],
    },
  geocoder: {
      type: Boolean,
      required: false,
    default: true,
  },
  addPointer: {
      type: Boolean,
      required: true,
      default: false,
  }
})

const geocoder = ref(MapboxGeocoder)
let map = mapboxgl
const zoomLevel = ref(7)
const addMarker = ref(false)
const sideListing = ref(false)
const pointers = ref(false)
const geolocation = reactive({
  latitude: 42.,
  longitude: 21,
})

const initMap = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh1Z2hwMGFxYjN2cW04a2VzZG45ayJ9.NPMzgIBJyThmJnPcwtBL6Q'
        map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/veroni88/clf4ajgp6008401pedjivmubf',
    center: [geolocation.longitude,geolocation.latitude],
    zoom: 8,
    minZoom: 7.5,
    accessToken: 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh1Z2hwMGFxYjN2cW04a2VzZG45ayJ9.NPMzgIBJyThmJnPcwtBL6Q'
        });
    if(props.geocoder) {
      initializeGeodecoders()
    }


    map.on('load', (e) => {
        console.log('e', e)
        pointers.value = true
        sideListing.value = true
      setInterval(() => {
        const currentLevel = map.getZoom()
        if(checkZoomLevel(zoomLevel.value,currentLevel)) {
          zoomLevel.value = currentLevel
          emits('zoom', zoomLevel.value)
        }
      }, 1200)
    })
    if(props.addPointer) {
      map.on('dblclick', (e) => {
        emits('pointer', {lng: e.lngLat.lng, lat: e.lngLat.lat})
      })
    }

}

const initializeGeodecoders = () => {
    geocoder.value = new MapboxGeocoder({
        accessToken: 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh1Z2hwMGFxYjN2cW04a2VzZG45ayJ9.NPMzgIBJyThmJnPcwtBL6Q',
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
})

onBeforeUnmount(() => {
  map.remove()
})
</script>


<template>
  <div
    class="flex flex-row"
  >
    <slot
      v-if="sideListing"
      name="sidelist"
      :map="map"
    />
    <div
      id="map"
      ref="mapContainer"
      class="min-h-screen min-w-full"
    />
    <slot
      v-if="pointers"
      name="pointers"
      :map="map"
    />
  </div>
</template>

<style>
.map__gl {
    min-width: 130px;
    min-height: 130px;
    border-radius: 5px;
  width: 100%;
  height: 100%;
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

.mapboxgl-ctrl-attrib {
  display: none;
}
</style>
