<script setup>
import moment from 'moment'
import {onBeforeUnmount, onMounted, ref} from 'vue';
import Spinner from '../Spinner.vue'
const scrollList = ref(null)
const emits = defineEmits(['load-more'])

const props = defineProps({
    orders:{
        type: Array,
        required: true,
    }
})


onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = (evt) => {
  let element = scrollList.value
    if(element.getBoundingClientRect().bottom < window.innerHeight + 40) {
       emits('load-more')
    }
}

const transformDates = (date) => {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}
</script>

<template>
  <ol
    v-if="orders"
    ref="scrollList"
    class=" bg-zinc-50 flex flex-col items-center shadow-sm m-4 rounded"
  >
    <li
      v-for="order in orders"
      :key="order._id"
      class="bg-white w-fit sm:w-full flex flex-col items-center md:flex-row justify-between shadow-md mb-2 p-2"
    >
      <div class="flex flex-col ml-2 w-full md:w-auto ">
        <span class="text-zinc-500">Ordered By</span>
        <div class="flex flex-row items-center">
          <div class="w-8 h-8 bg-zinc-900 rounded-full" />
          <div class="flex flex-col text-left">
            <h4 class="text-lg font-bold">
              {{ order['person-name'] }}
            </h4>
            <h5 class="text-sm">
              {{ order['person-email'] }} <span class="text-xs">{{ order['person-phone'] }}</span>
            </h5>
          </div>
        </div>
      </div>
      <div class="flex flex-col ml-2 w-full md:w-auto">
        <span class="text-zinc-500">Order</span>
        <div class="lowercase text-sm">
          <p class="mb-1">
            <span class="lowercase font-bold">Started:</span>{{ transformDates(order['order-duration'].startAt) }}
          </p>
          <p><span class="lowercase font-bold">Ends:</span> {{ transformDates(order['order-duration'].endAt) }}</p>
        </div>
      </div>
      <div class="flex flex-col md:items-center justify-between ml-2 w-full md:w-auto">
        <span>Ordered At</span>
        <p>{{ transformDates(order['ordered-at']) }}</p>
      </div>
      <div class="flex flex-col md:items-center justify-between ml-2 w-full md:w-auto">
        <span class="flex flex-col">Status</span>
        <div :class="`w-fit md:w-auto mb-2 rounded-lg text-white text-sm p-1 ${order['order-duration'].completed ? 'bg-green-400' : 'bg-blue-400'}`">
          {{ order['order-duration'].completed ? 'Completed' : 'Ongoing' }}
        </div>
      </div>
      <div class="flex flex-col md:items-center justify-between ml-2 w-full md:w-auto">
        <span>Type</span>
        <div class="w-fit md:w-auto rounded-lg mb-2 text-white bg-zinc-900 p-1">
          {{ order['order-privilege'] }}
        </div>
      </div>
      <div class="flex flex-col md:items-center justify-between ml-2 w-full md:w-auto">
        <span>Price</span>
        <small class="w-fit bg-green-400 md:w-auto rounded-lg mb-2 text-white p-1">{{ order['order-price'] }}€</small>
      </div>
    </li>
  </ol>
  <div
    v-else
    class="w-full flex flex-row items-center justify-center mt-8"
  >
    <Spinner />
    <p>Orders are Loading</p>
  </div>
</template>
