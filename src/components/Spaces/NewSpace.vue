<script setup>
import { onMounted, ref, reactive} from 'vue'
import { useRouter, useRoute } from 'vue-router';
import MapEmbed from "@/components/MapEmbed.vue";
import MapPointer from "@/components/MapPointer.vue";
const router = useRouter()
const route = useRoute()
const props = defineProps({
    auth: {
        type: Object,
        required: true,
     }
})
let space = reactive({
    title: '',
    amount: 0,
    location: {},
    createdBy: null,
    createdAt: Date.now(),
    pricePoints:  {
      hour: 1,
      day: 10,
      month: 150,
    },
    premiumFeatures: {
        analytics: false,
        messaging: false,
        'real-time': false,
    }
})

onMounted(() => {
    if (props.auth && props.auth.uid) {
        space.createdBy = {uid:props.auth.uid, email: props.auth.email, displayName: props.auth.providerData[0].displayName}
    }
})

async function getAddressFromCoords() {
      const lng = space.location.lng;
      const lat = space.location.lat;
      const accessToken = 'pk.eyJ1IjoidmVyb25pODgiLCJhIjoiY2xjamh2dmc4MGl5bzN3bXRsNGRmbDVqOCJ9.egn7CgNwwq8bmEtE1pkXyw';
      const endpoint = 'mapbox.places';
      const limit = 1;
      const url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${lng},${lat}.json?access_token=${accessToken}&limit=${limit}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features.length > 0) {
          space.location.locationName = data.features[0].place_name;
          space.location.shortCode = data.features[0].context[data.features[0].context.length - 1]['short_code']
          space.location.country = data.features[0].context[data.features[0].context.length - 1].text
          space.location.city = data.features[0].context[1].text
        } else {
           space.location.locationName = 'No address found';
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
        body: JSON.stringify(space)
        })
        .then(response => response.json())
        .then(data => {
            space = data
        })
        if (space.premiumFeatures.analytics) {
        await fetch(`${import.meta.env.VITE_PARKLACEAPI}/analytics/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: space._id,
                amount: space.amount,
                views: []
                })
            })
    }

    if (space._id) {
     await  router.push(`/space/panel/${space._id}`)
    }
}
const addPointerEvent = (event) => {
  if(!space.location.lng) {
    space.location = event
  }
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 mb-2">
    <div class="w-full h-full items-center">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-3xl font-extrabold text-center text-gray-900">
          Create a New Parking Space
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            class="space-y-6"
          >
            <div>
              <label
                for="parking-name"
                class="block text-sm font-medium text-gray-700"
              >
                Parking Name
              </label>
              <div class="mt-1">
                <input
                  id="parking-name"
                  v-model="space.title"
                  name="parking-name"
                  type="text"
                  autocomplete="off"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
            </div>

            <div>
              <label
                for="parking-amount"
                class="block text-sm font-medium text-gray-700"
              >
                Parking Amount
              </label>
              <div class="mt-1">
                <input
                  id="parking-amount"
                  v-model="space.amount"
                  name="parking-amount"
                  type="number"
                  autocomplete="off"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
            </div>

            <div class="w-full flex flex-col flex-start justify-start">
              <div class="flex justify-center w-fit mb-2">
                <div>
                  <input
                    id="flexSwitchChecked"
                    v-model="space.premiumFeatures.analytics"
                    class="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 dark:bg-neutral-600 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 dark:after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary dark:checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary dark:checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                    type="checkbox"
                    role="switch"
                    checked
                  >
                  <label
                    class="inline-block pl-[0.15rem] hover:cursor-pointer"
                    for="flexSwitchChecked"
                  >Analytics</label>
                </div>
              </div>
              <div class="flex justify-center w-fit mb-2">
                <div>
                  <input
                    id="flexSwitchChecked"
                    v-model="space.premiumFeatures['real-time']"
                    class="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 dark:bg-neutral-600 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 dark:after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary dark:checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary dark:checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                    type="checkbox"
                    role="switch"
                    checked
                  >
                  <label
                    class="inline-block pl-[0.15rem] hover:cursor-pointer"
                    for="flexSwitchChecked"
                  >Real Time Admission</label>
                </div>
              </div>
              <div class="flex justify-center w-fit mb-2">
                <div>
                  <input
                    id="flexSwitchChecked"
                    v-model="space.premiumFeatures.messaging"
                    class="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 dark:bg-neutral-600 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 dark:after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary dark:checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary dark:checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                    type="checkbox"
                    role="switch"
                    checked
                  >
                  <label
                    class="inline-block pl-[0.15rem] hover:cursor-pointer"
                    for="flexSwitchChecked"
                  >SMS Confirmation</label>
                </div>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row">
              <div class="flex flex-col">
                <label
                  for="hourly-input"
                  class="text-sm text-slate-500"
                >
                  Hourly Rate
                </label>
                <input
                  id="hourly-input"
                  v-model="space.pricePoints.hour"
                  type="number"
                  min="1"
                  class="appearance-none w-full sm:w-4/6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
              <div class="flex flex-col">
                <label
                  class="text-sm text-slate-500"
                  for="hourly-input"
                >
                  Daily Rate
                </label>
                <input
                  id="hourly-input"
                  v-model="space.pricePoints.day"
                  type="number"
                  min="1"
                  class="appearance-none w-full sm:w-4/6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
              <div class="flex flex-col">
                <label
                  class="text-sm text-slate-500"
                  for="hourly-input"
                >
                  Monthly Rate
                </label>
                <input
                  id="hourly-input"
                  v-model="space.pricePoints.month"
                  type="number"
                  min="1"
                  class="appearance-none w-full sm:w-4/6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
            </div>

            <div class="">
              <label
                for="location-map"
                class="text-sm text-slate-500 hover:text-blue-400"
              >Location {{ space.location.lng ? '(Right Click to Remove Location)' : '(Double click to add Location)' }}</label>
              <div
                id="location-map"
                class="h-[42vw] sm:h-[22vw] border-2 rounded items-center overflow-hidden "
              >
                <MapEmbed
                  :geocoder="false"
                  :add-pointer="true"
                  @pointer="(e) => addPointerEvent(e)"
                >
                  <template #pointers="{map}">
                    <MapPointer
                      v-if="space.location.lng && space.location.lat"
                      :pointer="space"
                      :map="map"
                      :removable="true"
                      @clean="space.location = {}"
                      reference="new-point"
                    />
                  </template>
                </MapEmbed>
              </div>
            </div>

            <div class="flex flex-col">
              <button
                type="reset"
                class="group mb-2 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-stone-300 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="router.go(-1)"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <!-- Heroicon name: lock-closed -->
                  <svg
                    class="h-5 w-5 text-slate-900 hover:text-slate-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 2a3 3 0 00-3 3v2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-1V5a3 3 0 00-3-3h-2zm0 10a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Cancel
              </button>
              <button
                type="submit"
                @click.prevent="addSpace"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <!-- Heroicon name: lock-closed -->
                  <svg
                    class="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 2a3 3 0 00-3 3v2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-1V5a3 3 0 00-3-3h-2zm0 10a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Create Parking Space
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
