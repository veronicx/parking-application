<script setup>
import { Map } from 'mapbox-gl'
import { GoogleRoute } from "@/models/map";

defineProps({
  locations: {
    type: Array,
    required: true,
  },
  map: {
    type: Map,
    required: true
  }
})
const returnGoogleLink = (lng,lat) => GoogleRoute(lng,lat)
</script>

<template>
  <div class="flex flex-col overflow-y-auto h-full w-3/12 bg-slate-50">
    <div
      v-for="location in locations"
      :key="location"
      class="border-2 border-red-500 p-2"
    >
      <h3>{{ location.title }}</h3>
      <div>
        <div class="flex flex-col">
          <small> Parking Space:{{ location.amount }}</small>
          <small>Location: {{ location.location.locationName }}</small>
          <div class="flex flex-row">
            <button class="border-2 border-red-500 w-fit p-2">Order</button>
            <button class="border-2 border-blue-400">Save</button>
          </div>
          <a class="border-2 border-red-500 w-fit w-6 h-6 object-cover" :href="returnGoogleLink(location.location.lng,location.location.lat)" target="_blank">
            <img class="w-4 h-4" src="../assets/map/google.svg" alt="">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
