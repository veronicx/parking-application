<script setup>
import { ref, onMounted, watch } from 'vue'
import { Map, Marker} from 'mapbox-gl'
import Popup from '@/components/Popup.vue'
import { PointerTypes } from "@/models/map";

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
  markerType: {
    type: Number,
    required: true,
  },
  clear: {
    type: Boolean,
    required: true
  }
})
const cleanMarker = ref(props.clear)
let marker = Marker
const type = PointerTypes(props.markerType)
const mountedStatus = ref(false)

watch(() => props.clear, (newVal) => {
  console.log('clean marker', newVal)
  if(newVal) {
    marker.remove()
  }
}, { immediate: true, deep: true, flush: "pre"})

const initializePointer = () => {

  let element = document.getElementById(props.reference)
  element.className = 'w-8 h-8'
   marker = new Marker(element).setLngLat([props.pointer?.location?.lng || props.pointer?.location?.coordinates[0],props?.pointer.location?.lat || props.pointer?.location?.coordinates[1]])
 marker.addTo(props.map)
}

onMounted(() => {
  initializePointer()
  mountedStatus.value = true
})

const openPopup = ref(false)
const tickleMe = () => {
  openPopup.value = !openPopup.value
  goToPointer()
}

const goToPointer = () => {

  props.map.flyTo({
    center: PointerTypes(props.markerType)  === 'regional' ? [props.pointer?.location.lng,props.pointer?.location.lat] : [props.pointer?.location?.coordinates[0],props.pointer.location?.coordinates[1]],
    zoom: 11,
  })
}

</script>

<template>
  <div
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
</template>

