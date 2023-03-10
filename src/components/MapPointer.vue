<script setup>
import { ref, onMounted, watch } from 'vue'
import { Map, Marker} from 'mapbox-gl'
import Popup from '@/components/Popup.vue'
import { pointerType } from "@/helpers/map";

const emits = defineEmits(['zoom'])
const props = defineProps({
  map: {
    type: Map,
    required: true,
  },
  pointer: {
    type: Object,
    required: true
  },
  reference: {
    type: String,
    required: true,
  },
  clear: {
    type: Array,
    required: true
  }
})
const allMarkers = ref(props.clear)
let marker = Marker
const type = pointerType(props.markerType)
const elm = ref({})

watch(allMarkers.value, (newVal, oldVal) => {
      const found  = newVal.find(item =>  item.location.lng === props.pointer?.location.lng && item.location.lat === props.pointer?.location.lat)
      if(found && false) {
          props.map.removeLayer(marker)
      }
}, { immediate: true, deep: true, flush: "pre"})

const initializePointer = () => {

  let element = document.getElementById(props.reference)
    element.className = 'w-8 h-8'
    marker = new Marker(element).setLngLat([props.pointer?.location?.lng,props?.pointer.location?.lat])
    marker.addTo(props.map)
}

onMounted(() => {
  initializePointer()
})

const openPopup = ref(false)
const tickleMe = () => {
  openPopup.value = !openPopup.value
  goToPointer()
}

const goToPointer = () => {

  props.map.flyTo({
    center: [props.pointer?.location.lng,props.pointer?.location.lat],
    zoom: 11,
  })
}

</script>

<template>
  <div
    v-if="allMarkers.find(item => item.location.lng === pointer?.location.lng && item.location.lat === pointer?.location.lat)"
    :id="reference"
    class="hidden"
  >
    <div
      class="cursor-pointer"
      @click="tickleMe()"
    >
      <img
        v-if="!pointer.count && !pointer.coordinates"
        src="../assets/map/marker.svg"
        alt=""
      >
      <div
        v-else
        class="rounded-full w-8 h-8 p-4 flex items-center justify-center  bg-blue-400"
      >
        <span class="text-white">{{ pointer.count }}</span>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

