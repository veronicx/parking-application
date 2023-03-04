<script setup>

import { ref, defineProps, watch, onMounted, reactive} from 'vue';
import { useRoute } from 'vue-router';
import moment from 'moment'
import OrdersListing from './OrdersListing.vue'
import AnalyticChart from './AnalyticChart.vue';
import TDropdown from "@/components/TDropdown.vue";
import { generateLabels} from '../../models/chart'
import Spinner from '../Spinner.vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';


const props = defineProps({
    auth: {
        type: Object,
        required: true,
     }
})

// Route
const route = useRoute()

//Declarations
const panel = ref(null)
const toggleFilters = ref(false)
const disableInfiniteScrolling = ref(false)
let chart = reactive({})
const chartData = ref([])
const analytics = ref([])
const labels = ref([])
const orders = ref([])
const filters = reactive({
  timeFilter: 'yearly',
  statusFilter: 'all',
  offset: 0,
  limit: 5
})

const timeFilterOptions = ref([
      {title: 'monthly', type: 'button'},
      { title: 'yearly', type: 'button'},
      { title: 'weekly', type: 'button'},
    ]
)

const statusFilterOptions = ref([
  {title: 'all', type: 'button'},
  {title: 'completed', type: 'button'},
  {title: 'ongoing', type: 'button'},
])

const filter = {
  startDate: Date.now(),
  endDate: Date.now()
}

const fetchPanel = async () => {
  await fetch(`${import.meta.env.VITE_PARKLACEAPI}/space/panel/${route.params.id}`)
      .then(response => response.json())
        .then(data =>  panel.value = data)
}

const fetchChart = async () => {
  // /order/chart/:id/:type
  await fetch(`${import.meta.env.VITE_PARKLACEAPI}/order/chart/${route.params.id}/${filters.timeFilter}`)
      .then(response => response.json())
          .then(data => {
            chartData.value = data
          })
}
const fetchOrders = async() => {
  // /order/listing/:id/:type/:offset?/:limit?/:start?/:end? //
  await fetch(`${import.meta.env.VITE_PARKLACEAPI}/order/listing/${route.params.id}/${filters.timeFilter}/${filters.offset}/${filters.limit}`)
      .then(response => response.json())
        .then(data => {
          if(data.length <= 0) {
            disableInfiniteScrolling.value = true
          }
          orders.value = [...orders.value, ...data]
        })
}


const generateAnalytics = async(type = 'orders') => {
  if(type === 'orders') {
    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/analytics/${route.params.id}/orders`)
  .then(response => response.json())
  .then(data => analytics.value = data)
  }
}



const generateChart  = async () => {
  await fetchChart()
  labels.value = generateLabels(filters.timeFilter)
   chart =  {
    labels: labels.value,
    datasets: [
      {
        label: 'Orders',
        data: chartData.value,
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa',
        color: '#60a5fa',
        tension: 0.1,
        lineTension: 0.3,
            borderCapStyle: 'butt',
            borderJoinStyle: 'miter',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,

      }
    ]
  }
}

onMounted( async() => {
  if (route.params.id) {
    await fetchPanel()
    await fetchOrders()
     await generateChart()
    await generateAnalytics()
  }
})

const loadMore = async () => {
  if(!disableInfiniteScrolling.value) {
    filters.offset += 5
    await fetchOrders()
  }

}

const generateTime = () => {
  let collection = 0
  if (panel.value.analytics && panel.value.analytics[0].views && panel.value.analytics[0].views.length > 0) {
    panel.value.analytics[0].views.forEach(item => collection += Number(item.time))
    collection = collection / panel.value.analytics[0].views.length
    }
  return `)${Math.floor(collection)}s`
}

const generateOrders = () => {
  let orders = 0
  if (analytics.value && analytics.value.length > 0) {
    analytics.value.forEach(view => {
      if (view.ordered) {
          orders++
        }
    })
  }
    return Math.floor(orders / analytics.value.length)
}

const formatTime = (time) => {
  return moment(time).format('MMMM Do YYYY')
}

const generateProfitAnalytic = () => {
  let profit = 0
  if(orders.value && orders.value.length > 0) {
      orders.value.forEach(order => {
         profit += order['order-price']
      })
  }
  return profit
}

const changeFilterType  = (option, type) =>  {
  if(type === 'time') {
    filters.timeFilter = option.title
  }
  if(type === 'status') {
    filters.statusFilter = option.title
  }
}

const filteredOrders = ref(() => {
  let cc = 0
  if(chartData.value && chartData.value.length > 0) {
    chartData.value.forEach(data => cc += data)
  }
  return cc
})

watch(() => filters.timeFilter,
    async (newVal,oldVal) => {
        if(newVal !== oldVal) {
          filters.offset = 0
          disableInfiniteScrolling.value = false
          orders.value = []
          await fetchOrders()
          await generateChart()
        }
    },
    { deep: true}
)
</script>


<template>
  <div
    v-if="panel"
    class="flex flex-col justify-center w-full"
  >
    <h1>{{ chartData }} {{ labels }}</h1>
    <section class="w-full bg-white shadow-sm flex flex-col md:flex-row items-center justify-between self-start p-4">
      <div class="w-3/6 lg:w-fit bg-white h-fit flex flex-col  md:items-center md:self-start p-2 md:mr-6">
        <span class="text-lg  text-zinc-400">Manager</span>
        <div class="flex flex-row items-center">
          <img
            src="../../assets/avatar2.png"
            class="w-12 h-12 rounded-full"
            alt=""
          >
          <span class="text-sm">{{ panel.space[0].createdBy.email || panel.space[0].createdBy.displayName }}</span>
        </div>
      </div>
      <div class="w-3/6 md:w-auto flex flex-col md:mr-6">
        <span class="text-lg  text-zinc-400">Space Title</span>
        <p class="text-sm">
          {{ panel.space[0].title }}
        </p>
      </div>
      <div class="w-3/6 md:w-auto flex flex-col md:mr-6">
        <span class="text-lg  text-zinc-400">Space Amount</span>
        <p class="text-sm">
          {{ panel.space[0].amount }}
        </p>
      </div>
      <div class="w-3/6 md:w-auto flex flex-col md:mr-6">
        <span class="text-lg  text-zinc-400">Space Created</span>
        <p class="text-sm">
          {{ formatTime(panel.space[0].createdAt) }}
        </p>
      </div>
      <div class="w-3/6 md:w-auto flex flex-col">
        <span class="text-lg  text-zinc-400">Space Location</span>
        <p class="text-sm break-words">
          {{ panel.space[0].location.locationName }}
        </p>
      </div>
    </section>
    <div class="flex flex-col mt-4">
      <div class="flex flex-row justify-left p-2 w-full bg-gradient-to-tl from-blue-50  via-white to-slate-50  items-center">
        <img
          class="w-5 h-5 object-contain cursor-pointer"
          src="@/assets/filter-6536.svg"
          alt=""
          @click="toggleFilters = !toggleFilters"
        >
        <section
          v-if="toggleFilters"
          class="flex  justify-left ml-4 w-4/6"
        >
          <TDropdown
            class="mr-4"
          >
            <template #header="{onClick}">
              <button
                class="bg-blue-300 text-white w-16 text-slate-600 rounded-full text-xs p-1"
                @click="onClick"
              >
                Time
              </button>
            </template>
            <template #options>
              <div
                v-for="option in timeFilterOptions"
                :key="option.title + option.type"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                @click.prevent="changeFilterType(option, 'time')"
              >
                <small>{{ option.title }}</small>
              </div>
            </template>
          </TDropdown>
          <TDropdown>
            <template #header="{onClick}">
              <button
                class="bg-blue-300 text-white w-16 text-slate-600 rounded-full text-xs p-1"
                @click="onClick"
              >
                Status
              </button>
            </template>
            <template #options>
              <div
                v-for="option in statusFilterOptions"
                :key="option.title + option.type"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                @click.prevent="changeFilterType(option, 'status')"
              >
                <small>{{ option.title }}</small>
              </div>
            </template>
          </TDropdown>
        </section>
      </div>
      <section class=" bg-white flex items-stretch flex-col md:flex-row mb-8 p-4">
        <AnalyticChart
          v-if="chart && chart.labels"
          :collection="chart"
          class="w-full md:w-4/5 bg-gradient-to-tl from-slate-100  via-white to-gray-100 "
        />
        <div class="md:ml-2 w-full md:w-2/6 flex flex-row flex-wrap items-center md:flex-col bg-zinc-50">
          <div class="md:mb-4 w-3/6 shadow-blue-100 shadow-sm flex flex-col items-center hover:shadow-blue-400 md:w-5/6 text-center">
            <font-awesome-icon
              class="bg-slate-900 h-6 w-6 p-2 mt-2 text-zinc-50 rounded-full"
              icon="fa-solid fa-users-viewfinder"
            />
            <small class="text-zinc-400 text-lg">Views</small>
            <h3 class="font-bold text-2xl text-zinc-900 text-center font-sans">
              {{ analytics.length }}
            </h3>
          </div>
          <div class="md:mb-4 w-3/6 shadow-blue-100 shadow-sm flex flex-col items-center hover:shadow-blue-400 md:w-5/6 text-center">
            <font-awesome-icon
              class="bg-blue-400 h-6 w-6 p-2 mt-2 text-zinc-50 rounded-full"
              icon="fa-solid fa-car-on"
            />
            <small class="text-zinc-400 text-lg">Orders</small>
            <h3 class="font-bold text-2xl text-zinc-900 text-center font-sans">
              {{ filteredOrders() }}
            </h3>
          </div>
          <div class="w-3/6 shadow-blue-100 shadow-sm flex flex-col items-center hover:shadow-blue-400 md:w-5/6 text-center">
            <font-awesome-icon
              icon="fa-solid fa-money-bills"
              class="bg-green-400 h-6 w-6 p-2 mt-2 text-zinc-50 rounded-full"
            />
            <small class="text-zinc-400 text-lg">Profit</small>
            <h3 class="font-bold text-xl text-zinc-900 text-center font-sans">
              {{ generateProfitAnalytic() }}€
            </h3>
          </div>
        </div>
      </section>
    </div>
    <section>
      <OrdersListing
        :orders="orders"
        @load-more="loadMore()"
      />
    </section>
  </div>
  <div v-else>
    <Spinner />
  </div>
</template>

