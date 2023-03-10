<script setup>
import { listingStore } from '../../stores/index';
import { validateInput } from '../../helpers/validations';
import { onMounted, ref, defineProps, onBeforeUnmount, computed } from 'vue'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { useRoute } from 'vue-router';
import moment from 'moment'
import Modal from '../Modal.vue';
const props = defineProps({
    auth: {
        type: Object,
        required: true
    }
})



const inputClass = ref('bg-gray-50 border outline-none uppercase border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5')
const route = useRoute()
const data = ref({})
const id = ref('')
const qrCode = ref('')
const modalToggler = ref(false)
const newOrder = ref({
    personName: '',
    personPhone: '',
    personEmail: '',
    'order-duration': {
        startAt: '',
        endAt: ''
    },
    'order-privilege': 'standard',
    price: 0,
})

const errorObject = ref({
    name: {
        message: '',
        checked: false,
    },
    lastName: {
        message: '',
        checked: false,
    },
    email: {
        message: '',
        checked: false,
    },
    phone: {
        message: '',
        checked: false,
    },
    order: {
        message: '',
        checked: false,
    },
})

const collection = ref({
    viewed: Date.now(),
    time: 0,
    viewedBy: {},
    ordered: false,
})

const startAnalytics = () => {
        collection.value.viewed = Date.now()
        collection.value.viewedBy =  props.auth.uid ? props.auth.uid : {
        icognito: true,
        id: localStorage.getItem('sessionId'),
        }
}

function generateID() {
  var id = "random-";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return id;
}


const config = {
        enableTime: true,
        noCalendar: false,
        dateFormat: 'Y-m-d H:i',
        minDate: Date.now(),
}

const calculateDuration = computed(() => {

    const startDate = newOrder.value['order-duration'].startAt
    const endDate = newOrder.value['order-duration'].endAt

  const dateFormat = 'HH:mm:ss DD-MM-YYYY';
  const start = moment(startDate, dateFormat);
  const end = moment(endDate, dateFormat);
  const duration = end.diff(start, 'minutes');

  if (duration < 60) {
    return 1;
  }

  const hours = duration / 60;

  const roundedHours = Math.ceil(hours);
  return roundedHours;
})

const checkout = ref((duration) => {

    newOrder.value.price = duration / data.value.orderPricePoints[0].price
    if (duration >= 24) {
            return `${Math.floor(duration / 24)} Day`
    }
    else {
            return `${duration} Hours`
         }
})



const handleInput = (key,value) => {
    const data = validateInput(key,value)
    if(data.key && data.message) {
        errorObject.value[key].message = data.message
    } else {
        errorObject.value[key].message = ''
        errorObject.value[key].checked = false
    }
}

onMounted(async () => {
     id.value = route.params.id
    if (listingStore().listing.find(item => item._id === id.value)) {
        data.value = listingStore().listing.find(item => item._id === id.value)
    }
    else {
        await fetch(`${import.meta.env.VITE_PARKLACEAPI}/spaces/one/${route.params.id}`)
            .then(response => response.json())
                    .then(response => data.value = response)
    }
    if (data.value.premiumFeatures.analytics) {
        startAnalytics()
    }

})
onBeforeUnmount(async () => {
    collection.value.time = Math.abs(Date.now() - collection.value.viewed) / 1000

    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/analytics/view/add`,  {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id.value, view:collection.value})
    })
        .then(response => response.json())
            .then(response => {})
})

const submitOrder = async () => {
    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/order/new`,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'space-id': data.value._id,
            'person-id': props.auth.uid ? props.auth.uid : localStorage.getItem('sessionId'),
            'person-name': newOrder.value.personName,
            'person-email': newOrder.value.personEmail,
            'person-phone': newOrder.value.personPhone,
            'order-duration': {
                'startAt': moment(newOrder.value['order-duration'].startAt).toDate(),
                'endAt': moment(newOrder.value['order-duration'].endAt).toDate(),
                'completed': false
            },
            'order-price': newOrder.value.price,
            'order-privilege': newOrder.value['order-privilege'],
            'ordered-at': Date.now(),
            'org': 'localhost:3000'
            })
        })
            .then(response => response.json())
                .then(data => {
                    if(data) {
                        modalToggler.value = true
                        qrCode.value = data['qr-code']
                        collection.value.ordered = true
                    }
                })

}

</script>

<template>
  <div class="flex flex-col items-center w-full mt-4 mb-4">
    <img
      v-if="qrCode"
      :src="qrCode"
      alt=""
    >
    {{ newOrder['order-duration'].startAt }} {{ newOrder['order-duration'].endAt }}
    <div class="flex flex-col w-3/6  shadow-blue-400 shadow-md text-sm rounded-lg">
      <header class="w-full rounded-t-lg bg-slate-900 p-4 text-2xl tracking-wider text-white">
        Order for {{ data.title }}
      </header>
      <div class="flex flex-col justify-center items-center md:flex-row w-full">
        <img
          src="../../assets/explore2.jpg"
          alt=""
          class="w-3/6 object-contain"
        >
        <div class="flex flex-col w-5/6 md:w-3/6">
          <section class="w-full flex-col justify-start md:p-2">
            <span class="text-lg text-slate-400 ml-1">Name</span>
            <input
              v-model="newOrder.personName"
              type="text"
              placeholder="Name..."
              :class="`${inputClass} ${errorObject['name'].message && errorObject['name'].checked ? 'border-red-500 focus:border-red-600' : ''}`"
              @input="handleInput('name', newOrder.personName)"
              @mouseleave="errorObject['name'].message ? errorObject['name'].checked = true : errorObject['name'].checked = false"
            >
            <p
              v-if="errorObject['name'].checked"
              class="text-red-500 text-sm"
            >
              {{ errorObject['name'].message }}
            </p>
          </section>
          <section class="w-full flex-col justify-start md:p-2 mb-1">
            <span class="text-lg text-slate-400 ml-1">Phone Number</span>
            <input
              v-model="newOrder.personPhone"
              type="text"
              placeholder="+383 ...."
              :class="`${inputClass} ${errorObject['phone'].checked ? 'border-red-500 focus:border-red-600' : ''}`"
              @input="handleInput('phone', newOrder.personPhone)"
              @mouseleave="errorObject['phone'].message ? errorObject['phone'].checked = true : errorObject['phone'].checked = false"
            >
            <span
              v-if="errorObject['phone'].checked"
              class="text-red-500 text-sm"
            >{{ errorObject['phone'].message }}</span>
          </section>
          <section class="w-full flex-col justify-start md:p-2 mb-1">
            <span class="text-lg text-slate-400 ml-1">Email</span>
            <input
              v-model="newOrder.personEmail"
              type="mail"
              class="lowercase"
              placeholder="@..."
              :class="`${inputClass} ${errorObject['email'].checked ? 'border-red-500 focus:border-red-600' : ''}`"
              @input="handleInput('email', newOrder.personEmail)"
              @mouseleave="errorObject['email'].message ? errorObject['email'].checked = true : errorObject['email'].checked = false"
            >
            <span
              v-if="errorObject['email'].checked"
              class="text-red-500 text-sm"
            >{{ errorObject['email'].message }}</span>
          </section>
          <section class="w-full flex-col justify-center md:p-2 items-center">
            <span class="text-lg text-slate-400 ml-1">Duration</span>
            <div class="flex flex-col sm:items-center md:flex-row w-full flex-start mt-1">
              <div class="flex w-full flex-col md:w-3/6 md:mr-1">
                <span>Starting Date</span>
                <flat-pickr
                  v-model="newOrder['order-duration'].startAt"
                  :config="config"
                  placeholder="Starting Date..."
                  class="bg-slate-900 w-full p-4 rounded h-8 text-white"
                />
              </div>
              <div
                v-if="newOrder['order-duration'].startAt"
                class="flex flex-col w-full md:w-3/6 md:ml-1"
              >
                <span>Ending Date</span>
                <flat-pickr
                  v-model="newOrder['order-duration'].endAt"
                  :config="config"
                  placeholder="Ending Date..."
                  class="bg-slate-900 w-full p-4 rounded h-8 text-white"
                />
              </div>
            </div>
          </section>
          <div
            v-if="newOrder['order-duration'].startAt && newOrder['order-duration'].endAt"
            class="w-full flex-col justify-center md:p-2  mb-1"
          >
            <h4 class="mb-2">
              Total
            </h4>
            <h5 class="bg-slate-900 w-full p-2 rounded h-8 text-white">
              {{ checkout(calculateDuration) }} For {{ newOrder.price }}€
            </h5>
          </div>
          <div class="flex flex-row justify-center sm:mb-4 mt-2">
            <button class="bg-zinc-700 text-white p-2 rounded font-semibold mr-2">
              Cancel
            </button>
            <button
              class="bg-green-300 text-white p-2 rounded font-semibold ml-2"
              @click="submitOrder()"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    <Modal
      :open="modalToggler"
      :hide-footer="true"
      :hide-header="true"
      @close="modalToggler = false"
    >
      <div class="h-16">
        <img
          :src="qrCode['qr-code']"
          class="w-12 h-12"
          alt="qr for parking"
        >
      </div>
    </Modal>
  </div>
</template>
