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
const currentZoomLevel= ref(7)
onMounted(async () => {
     listing.value = await fetchMarkers(currentZoomLevel.value)
      sideList.value = await fetchMarkers(11)
})

const refetch = async (newZoomLevel) => {
  currentZoomLevel.value = newZoomLevel
    const data = await fetchMarkers(newZoomLevel)
        if(data.length !== listing.value.length) {
          listing.value = data
        }
}

watch(() => currentZoomLevel.value , async(newVal,oldVal) => {
     if(oldVal && newVal && checkZoomLevel(oldVal,newVal)) {
       removeMarkers.value = checkZoomLevel(oldVal,newVal)
       await refetch(newVal)
     }
}, { deep: true, immediate: true, flush: 'sync'})

</script>

<template>
  <div class="flex flex-col  h-100">
    <div
      class="flex flex-row justify-between h-full w-full p-2"
    >
      <MapEmbed
        :marker-options="false"
        class="h-full w-full"
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
