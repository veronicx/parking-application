<script setup>
import { onMounted, ref, reactive, watch} from 'vue'
import MapEmbed from "@/components/MapEmbed.vue";
import MapPointer from "@/components/MapPointer.vue";
import { pointerType, fetchMarkers, checkZoomLevel } from "@/helpers/map";
import MapSideList from "@/components/MapSideList.vue";

const listing = ref([])
const sideList = ref([])
const loading = ref(false)
const removeMarkers = ref(false)
let currentZoomLevel= ref(7)
onMounted(async () => {
  const localData = await fetchMarkers(11)
     listing.value = localData
      sideList.value = localData
})

const refetch = async (newZoomLevel) => {
  currentZoomLevel.value = newZoomLevel
    const data = await fetchMarkers(newZoomLevel)
        if(data.length !== listing.value.length) {
          listing.value = data
        }
}

</script>

<template>
  <div class="flex flex-col h-full border-2">
    <div
      class="flex flex-row justify-between h-screen w-full p-2 border-2 h-full"
    >
      <MapEmbed
        class="h-screen w-full"
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
              :key="location"
              :reference="`location-${idx}`"
              :pointer="location"
              :map="map"
              :clear="listing"
              @zoom="refetch"
            />
          </div>
        </template>
      </MapEmbed>
    </div>
  </div>
</template>
