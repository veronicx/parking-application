<script setup>
import { Chart, Line } from 'vue-chartjs'
import { options } from '../../models/chart'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  LineElement,
  Title,
  Tooltip,
  Legend
)

ChartJS.defaults.backgroundColor = 'f4f4fc'
ChartJS.defaults.color = 'black'
ChartJS.defaults.borderColor = 'f4f4fc'


defineProps({
  collection: {
    type: Object,
    required: false,
    default: () => {}
  }
})

const datas =  {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      color: '#60a5fa',
      backgroundColor: '#60a5fa',
      data: [40, 39, 10, 40, 39, 80, 40]
    }
  ]
}
</script>

<template>
  <div class="flex flex-row items-stretch">
    <Line
      class="h-full"
      :data="collection"
      :options="options"
    />
  </div>
</template>