<script setup>
import { onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import ParkingCard from '../components/Parking/ParkingCard.vue'
//GOOGLE MAP LATER BECAUSE OF KEY ISSUES REGARDING NOKEY ISSUE
// import { GoogleMap, Marker } from 'vue3-google-map'
const locations = ref([])
const router = useRouter()


onMounted(() => {
    console.log('hello', import.meta.env.VITE_KEY)
})

const addLocation = ref(false)

const CardEvents = ref((event) => {
    if (event) {
        locations.value.push(event)
        router.push(`/parking/manage/${event.name}`)
    }
    addLocation.value = false
})

</script>

<template>
    <div class="flex flex-col flex-wrap justify-center items-center pt-8">
        <h2 class="text-6xl m-8">Parkings</h2>
        <button v-if="!addLocation" @click="addLocation = !addLocation" class="w-48 h-12 bg-slate-400 rounded-sm m-8 text-center text-slate-900 hover:text-slate-100">Add Location</button>
        <ParkingCard v-if="addLocation" :parking="{name,managers,analytics,remorder}" @close="CardEvents" @submit="CardEvents" />
        <div v-if="locations">
            <div v-for="location in locations" :key="location.name">
            <div>
                <h3>{{location.name}}</h3>
                <div>
                    <label>
                        {{location.managers}}
                    </label>
                    <label>
                        {{location.analytics}}
                    </label>
                    <label>
                        {{location.remorder}}
                    </label>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>