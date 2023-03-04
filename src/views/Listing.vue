<script setup>
import { onMounted, ref, reactive, watch} from 'vue'
import MapEmbed from "@/components/MapEmbed.vue";
import MapPointer from "@/components/MapPointer.vue";
import { PointerTypes, RemoveMarkers, FetchMarkers } from "@/models/map";
import MapSideList from "@/components/MapSideList.vue";

const listing = ref([])
const sideList = ref([])
const loading = ref(false)
const removeMarkers = ref(false)
const currentZoomLevel= ref(7)
onMounted(async () => {
     listing.value = await FetchMarkers(currentZoomLevel.value)

})

const refetch = async (newZoomLevel) => {
  currentZoomLevel.value = newZoomLevel
    const data = await FetchMarkers(newZoomLevel)
        if(data.length !== listing.value.length) {
          listing.value = data
        }
}

watch(() => currentZoomLevel.value , (newVal,oldVal) => {
     if(newVal !== oldVal) {

     }
}, { deep: true, immediate: true, flush: 'sync'})

const markerToggle = () => {
  console.log('toggle')
  removeMarkers.value = !removeMarkers.value
}
</script>

<template>
  <div
    class="flex flex-row justify-between h-100 w-full p-2"
  >
    <button @click="markerToggle()">CLICK ME</button>
    <MapEmbed
      :marker-options="false"
      class="border-2 border-red-500 h-full w-full"
      @zoom="(e) => currentZoomLevel = e"
    >
      <template #sidelist="{ map }">
        <MapSideList
          class="absolute z-10"
          :locations="sideList"
          :map="map"
        />
      </template>
      <template #pointers="{ map }">
        <div
          v-for="(location,idx) in listing"
          :key="location"
        >
          <MapPointer
            :reference="`location-${idx}`"
            :pointer="location"
            :marker-type="currentZoomLevel"
            :map="map"
            :clear="removeMarkers"
            @zoom="refetch"
          />
        </div>
      </template>
    </MapEmbed>
  </div>
</template>
