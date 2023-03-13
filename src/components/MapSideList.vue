<script setup>
import { Map } from 'mapbox-gl'
import { googleRoute } from "@/helpers/map";
import { useRouter } from "vue-router";

const router = useRouter()

const props = defineProps({
  locations: {
    type: Array,
    required: true,
  },
  map: {
    required: true
  }
})
const returnGoogleLink = (lng,lat) => googleRoute(lng,lat)

const moveMap = (location) => {
  props.map.flyTo({
    center: [location.location.lng,location?.location.lat],
    zoom: 11,
  })
}

const redirectMe = (location) => {
    router.push(`/space/current/${location._id}`)
}


</script>

<template>
  <div class="flex flex-col overflow-y-auto h-full w-4/12 bg-slate-50">
    <h1 class="text-center mt-3 mb-3">
      Available Parking Locations
    </h1>
    <div class="flex flex-col overflow-y-scroll h-10/12">
      <div
        v-for="location in locations"
        :key="location"
        class="mb-4 border-2 border-slate-100 rounded-lg mr-2 flex flex-col   shadow-sm hover:shadow-md hover:shadow-blue-200"
        @click="moveMap(location)"
      >
        <div class="flex flex-col">
          <div
            id="parking-info__header"
            class="flex flex-row justify-between border-b border-blue-300 items-center"
          >
            <h1 class="text-slate-700 m-2 font-sans tracking-wide text-xl uppercase">
              {{ location.title }}
            </h1>
            <span class="text-slate-600 m-2 flex flex-row">
              <img
                src="../assets/parking-icon.png"
                class="w-4 h-4 mr-2"
                alt=""
              >
              <small class="font-bold">{{ location.amount }}</small>
            </span>
          </div>
          <div class="flex flex-col m-2 justify-start">
            <h2 class="text-slate-600 mb-2">
              Country: <strong>{{ location.location.country }}</strong>
            </h2>
            <h3 class="text-slate-600 mb-2">
              Address: <strong>{{ location.location.locationName }}</strong>
            </h3>
            <h4 class="text-slate-600 mb-2">
              Parking Spaces: <strong>{{ location.amount }}</strong>
            </h4>
          </div>
          <div class="flex flex-row justify-between p-2">
            <button
              class="rounded-lg border border-blue-400 text-blue-400 px-2 hover:border-blue-600 hover:text-blue-600"
              @click.self="redirectMe(location)"
            >
              Order
            </button>
            <div class="mr-4">
              <a
                class="w-fit w-6 h-6 object-cover"
                :href="returnGoogleLink(location.location.lng,location.location.lat)"
                target="_blank"
              >
                <img
                  class="w-4 h-4"
                  src="../assets/map/google.svg"
                  alt=""
                >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Set the width and height of the scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* Track styles */
::-webkit-scrollbar-track {
  background-color: #E2E8F0;
}

/* Handle styles */
::-webkit-scrollbar-thumb {
  background-color: #4A5568;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}

/* Handle when active (i.e. being dragged) */
::-webkit-scrollbar-thumb:active {
  background-color: #1A202C;
}
</style>
