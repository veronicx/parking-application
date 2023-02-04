<script setup>

import { ref, defineProps, defineAsyncComponent, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import moment from 'moment'
import OrdersListing from './OrdersListing.vue'
import AnalyticChart from './AnalyticChart.vue';
import { generateDailyLabels, generateChartData } from '../../models/chart'
import { async } from '@firebase/util';
import Spinner from '../Spinner.vue';
const AsyncChart = defineAsyncComponent(() => import('./AnalyticChart.vue'))



const props = defineProps({ 
    auth: { 
        type: Object,
        required: true,
     }
})

const panel = ref(null)
const route = useRoute()
const address = ref(null)
const ordersCollection = ref([])
const ordersLimit = ref(5)
const disableInfiniteScrolling = ref(false)
const chart = ref({})
const analytics = ref([])
const monthly = ref([])

const fetchPanel = async () => { 
  await fetch(`http://localhost:3000/space/panel/${route.params.id}`)
      .then(response => response.json())
        .then(data =>  panel.value = data)
}

const fetchOrders = async() => { 
  fetch(`http://localhost:3000/order/listing/${route.params.id}/${ordersLimit.value}`)
      .then(response => response.json())
        .then(data => {
          if(data.length === ordersCollection.value.length) { 
            disableInfiniteScrolling.value = true
          }
          ordersCollection.value = data
        })
}

const fetchMonthly = async() => { 
  let returnable = []
  await fetch(`http://localhost:3000/order/monthly/${route.params.id}`)
    .then(response => response.json())
      .then(data => returnable = data)

      return returnable
}

const generateAnalytics = async(type = 'monthly') => { 
  if(type === 'monthly') { 
    await fetch(`http://localhost:3000/analytics/${route.params.id}/monthly`)
      .then(response => response.json())
        .then(data => analytics.value = data)
  }
}

const generateChart  = async () => { 
  const arr =  await fetchMonthly()
  monthly.value = arr
  const labels = generateDailyLabels()
  const data = generateChartData(arr)
   chart.value =  { 
    labels,
    datasets: [
      {
        label: 'Orders',
        data,
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
    ordersLimit.value += 5
  
  await fetchOrders()
  }

}

const generateTime = () => { 
  let collection = 0
  if (panel.value.analytics && panel.value.analytics[0].views && panel.value.analytics[0].views.length > 0) {
    panel.value.analytics[0].views.forEach(item => collection += Number(item.time))
    collection = collection / panel.value.analytics[0].views.length
    }
  return `${Math.floor(collection)}s`
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
  if(monthly.value && monthly.value.length > 0) { 
      monthly.value.forEach(order => { 
         profit += order['order-price']
      })
  }
  return profit
}
</script>


<template>
  <div
    v-if="panel"
    class="flex flex-col justify-center w-full"
  >
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
            {{ monthly.length }}
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
    <section>
      <OrdersListing
        :orders="ordersCollection"
        @load-more="loadMore()"
      />
    </section>
  </div>
  <div v-else>
    <Spinner />
  </div>
</template>

