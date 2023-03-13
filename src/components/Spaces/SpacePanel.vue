<script setup>

import { ref, defineProps, watch, onMounted, reactive} from 'vue';
import { useRoute } from 'vue-router';
import moment from 'moment'
import OrdersListing from './OrdersListing.vue'
import AnalyticChart from './AnalyticChart.vue';
import TDropdown from "@/components/TDropdown.vue";
import { generateLabels} from '../../helpers/chart'
import Spinner from '../Spinner.vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Settings from "@/components/Spaces/Tabs/Settings.vue";


const props = defineProps({
    auth: {
        type: Object,
        required: true,
     }
})

// Route
const route = useRoute()

//Declarations
const panel = reactive({})
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
  await fetch(`${import.meta.env.VITE_PARKLACEAPI}/spaces/one/${route.params.id}`)
      .then(response => response.json())
        .then(data =>  panel.space = data)
}

const fetchChart = async () => {
  await fetch(`${import.meta.env.VITE_PARKLACEAPI}/order/chart/${route.params.id}/${filters.timeFilter}`)
      .then(response => response.json())
          .then(data => {
            chartData.value = data
          })
}
const fetchOrders = async() => {
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

watch(filters, (newVal) => {
  generateChart()
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

const changeFilterType  = (option) =>  {
    filters.timeFilter = option
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

const tabs = ref(['analytics', 'admission', 'billing', 'settings'])
const currentTab = ref('analytics')

const checkTab = (tab) => {
  currentTab.value = tab
}
</script>


<template>
  <div
    v-if="panel.space"
    class="flex flex-col justify-center w-full h-fit p-2"
  >
    <div class="h-fit flex flex-row">
      <div
        v-for="(tab,idx) in tabs"
        :key="tab + idx"
        class="mr-2"
      >
        <button
          class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4"
          :class="currentTab === tab ? 'text-blue-600' : 'text-slate-400'"
          @click="checkTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
    </div>
    <div
      v-if="currentTab === 'analytics'"
      class="flex flex-col justify-center"
    >
      <section
        v-if="panel.space.premiumFeatures.analytics"
        class="w-full bg-white shadow-sm flex flex-col md:flex-row items-center justify-between self-start p-4"
      >
        <div class="w-3/6 lg:w-fit bg-white h-fit flex flex-col  md:items-center md:self-start p-2 md:mr-6">
          <span class="text-lg  text-zinc-400">Manager</span>
          <div class="flex flex-row items-center">
            <img
              :src="auth.photoURL"
              class="w-12 h-12 rounded-full mr-4"
              alt=""
            >
            <span class="text-sm">{{ panel.space.createdBy.email || panel.space.createdBy.displayName }}</span>
          </div>
        </div>
        <div class="w-3/6 md:w-auto flex flex-col md:mr-6">
          <span class="text-lg  text-zinc-400">Space Title</span>
          <p class="text-sm">
            {{ panel.space.title }}
          </p>
        </div>
        <div class="w-3/6 md:w-auto flex flex-col md:mr-6">
          <span class="text-lg  text-zinc-400">Space Amount</span>
          <p class="text-sm">
            {{ panel.space.amount }}
          </p>
        </div>
        <div class="w-3/6 md:w-auto flex flex-col md:mr-6">
          <span class="text-lg  text-zinc-400">Space Created</span>
          <p class="text-sm">
            {{ formatTime(panel.space.createdAt) }}
          </p>
        </div>
        <div class="w-3/6 md:w-auto flex flex-col">
          <span class="text-lg  text-zinc-400">Space Location</span>
          <p class="text-sm break-words">
            {{ panel.space.location.locationName }}
          </p>
        </div>
      </section>
      <div
        v-if="panel.space.premiumFeatures.analytics"
        class="flex flex-col mt-4"
      >
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
                  @click.prevent="changeFilterType(option.title)"
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
      <section v-if="orders && orders.length">
        <OrdersListing
          :orders="orders"
          @load-more="loadMore()"
        />
      </section>
      <section
        v-else
        class="mt-8 p-8 text-center bg-slate-200 rounded"
      >
        There's no orders currently
      </section>
    </div>
    <div v-else-if="currentTab === 'admission'">
      <div>Admission</div>
    </div>
    <div v-else-if="currentTab === 'billing'">
      <h1>hello</h1>
    </div>
    <div v-else>
      <Settings :space="panel.space" />
    </div>
  </div>
  <div v-else>
    <Spinner />
  </div>
</template>

