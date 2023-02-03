<script setup>
import moment from 'moment'
import { onMounted, ref } from 'vue';
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

const handleScroll = (evt) => {
  let element = scrollList.value
  console.log(element, element.getBoundingClientRect().bottom, window.innerHeight + 40)
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
    class="border-2 bg-zinc-50 shadow-sm m-4 rounded"
  >
    <li
      v-for="order in orders"
      :key="order._id"
      class="bg-white flex flex-row justify-between shadow-md mb-2 p-2"
    >
      <div class="flex flex-col ml-2">
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
      <div class="flex flex-col">
        <span class="text-zinc-500">Order</span>
        <div class="lowercase text-sm">
          <p class="mb-1"><span class="lowercase font-bold">Started:</span>{{ transformDates(order['order-duration'].startAt) }}</p>
          <p><span class="lowercase font-bold">Ends:</span> {{ transformDates(order['order-duration'].endAt) }}</p>
        </div>
      </div>
      <div class="flex flex-col items-center justify-between">
        <span class="flex flex-col">Status</span>
        <div :class="` mb-2 rounded-lg text-white text-sm p-1 ${order['order-duration'].completed ? 'bg-green-400' : 'bg-blue-400'}`">{{ order['order-duration'].completed ? 'Completed' : 'Ongoing' }}</div>
      </div>
      <div class="flex flex-col items-center justify-between">
        <span>Type</span>
        <div class="rounded-lg mb-2 text-white bg-zinc-900 p-1">{{ order['order-privilege'] }}</div>
      </div>
      <div class="flex flex-col">
        <span>Price</span>
        <small class="m-auto bg-green-400 rounded-lg w-8 text-center">{{ order['order-price'] }}€</small>
      </div>
      <div class="flex flex-col">
        <span>Ordered At</span>
        <p>{{ transformDates(order['ordered-at']) }}</p>
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