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
    default: () => {},
  },
  pointer: {
    type: Object,
    required: true
  },
  reference: {
    type: String,
    required: false
  },
  clear: {
    type: Array,
    required: false
  }
})

const  marker = ref(Marker)


const initializePointer = () => {

  let element = document.getElementById(props.reference)
    element.className = 'w-8 h-8'
    marker.value = new Marker(element).setLngLat([props.pointer?.location?.lng,props?.pointer.location?.lat])
    marker.value.addTo(props.map)
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

