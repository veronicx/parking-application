<script setup>
import {reactive, onMounted} from 'vue'
import { updateProfile, updatePassword, updatePhoneNumber } from 'firebase/auth'
import moment from 'moment'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const props = defineProps({
  auth: {
    type: Object,
    required: true,
  }
})


const currentUpload =  reactive({photo: {}})
const uploadPhoto = async(event) => {
      currentUpload.photo = event.target.files[0]
    await uploadProfileImage(props.auth, event.target.files[0])
}

const uploadProfileImage = async (authUser, file) => {
  const storage = getStorage();
  const storageRef = ref(storage, `users/${authUser.uid}/${file.name}`);

  try {
    await uploadBytes(storageRef, file);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    // Update the user's profile with the image URL
    await updateProfile(authUser, {
      photoURL: downloadURL
    });

  } catch (error) {
    console.log('Error uploading file:', error);
  }
}

const mutable = reactive(props.auth)
let disableNameState = reactive({val: true})
let displayPhoneState = reactive( { val: true})

const password = reactive({firstPass: '', secondPass: ''})
let orders = reactive({listing: []})

onMounted( async () => {
    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/order/user/${mutable.uid}`)
      .then(response => response.json())
      .then(response => {
        orders.listing = response
      })
})

const dateFormatter = (date) => {
  return moment(date).format('MMMM d, YYYY')
}

const totalPrice = (listing) => {
    let total = 0
    listing.forEach(order => {
        total += order['order-price']
    })
  return total
}

const tabs = ref(['Profile', 'Orders'])
const currentTab = reactive({val: 'Profile'})
function checkTab(tab) {
  currentTab.val = tab
}


const submitChanges = async () => {
       await updateProfile(props.auth, {
        displayName: mutable.providerData[0].displayName,
      })
  if(password.firstPass === password.secondPass) {
    await updatePassword(props.auth, password.firstPass)
  }
  await updatePhoneNumber(props.auth, mutable.providerData[0].phoneNumber).then(response => {
    console.log('res', response)
  })

}

</script>

<template>
  <div class="flex flex-col  h-fit w-full py-12 px-8 items-center">
    <div
      v-if="tabs.length"
      class="h-fit flex flex-row"
    >
      <div
        v-for="(tab,idx) in tabs"
        :key="tab + idx"
        class="mr-2"
      >
        <button
          class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4"
          :class="currentTab.val === tab ? 'text-blue-600' : 'text-slate-400'"
          @click="checkTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
    </div>
    <div
      v-if="currentTab.val === 'Profile'"
      class="flex flex-col border-2 bg-slate-50 shadow-md shadow-blue-300 w-full mb-8 sm:mb-0 sm:w-2/6 sm:mr-4 py-2 w-full h-fit items-center justify-start"
    >
      <div class="flex mb-4">
        <img
          :src="mutable.photoURL"
          class="w-[8vw] h-[8vw] object-cover ml-4 rounded-full"
          alt=""
        >
        <input class="mt-4 ml-4" type="file" @change="uploadPhoto" placeholder="Change">
      </div>
      <div>
        <div class="w-full mb-4">
          <label
            for="parking-name"
            class="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div class="mt-1 flex flex-row  items-center">
            <input
              id="parking-name"
              v-model="mutable.email"
              name="parking-name"
              type="text"
              autocomplete="off"
              required
              disabled
              class="appearance-none mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
        </div>
        <div class="w-full mb-4">
          <label
            for="parking-name"
            class="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <div class="mt-1 flex flex-row  items-center">
            <input
              id="parking-name"
              v-model="mutable.providerData[0].displayName"
              name="parking-name"
              type="text"
              autocomplete="off"
              required
              class="appearance-none mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
        </div>
        <div class="w-full mb-4">
          <label
            for="parking-name"
            class="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <div class="mt-1 flex flex-row  items-center">
            <input
              id="parking-name"
              v-model="mutable.providerData[0].phoneNumber"
              name="parking-name"
              type="text"
              autocomplete="off"
              required
              class="appearance-none mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
        </div>
        <div class="w-full mb-4">
          <label
            for="parking-name"
            class="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div class="mt-1 flex flex-row  items-center">
            <input
              id="parking-name"
              v-model="password.firstPass"
              name="parking-name"
              type="password"
              autocomplete="off"
              required
              class="appearance-none mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
        </div>
        <div class="w-full mb-4">
          <label
            for="parking-name"
            class="block text-sm font-medium text-gray-700"
          >
            Password Re-Tpye
          </label>
          <div class="mt-1 flex flex-row  items-center">
            <input
              id="parking-name"
              v-model="password.secondPass"
              name="parking-name"
              type="password"
              autocomplete="off"
              required
              class="appearance-none mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
        </div>
      </div>
      <div class="flex self-center justify-between mb-2">
        <button class="px-2 bg-slate-900 text-white rounded mr-2">
          Cancel
        </button>
        <button @click="submitChanges()" class="px-2 bg-blue-400 text-slate-900 rounded ml-2">
          Submit
        </button>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col h-full w-full"
    >
      <div class="flex flex-row">
        <div class="bg-slate-900 text-white rounded px-4 py-2 mr-4">
          Orders: {{ orders.listing.length }}
        </div>
        <div class="bg-green-400 text-white rounded px-4 py-2 ml-4">
          Money: {{ totalPrice(orders.listing) }}$
        </div>
      </div>
      <div class="w-full w-full flex flex-col h-[43vw] pt-8  overflow-y-scroll mb-4">
        <div v-if="orders.listing && orders.listing.length">
          <div
            v-for="order in orders.listing"
            :key="order._id"
            class="flex sm:flex-row justify-between rounded w-full bg-stone-50 shadow-sm p-2"
          >
            <div class="w-4/6 flex flex-col">
              <h4 class="uppercase border-slate-100 border-b-2">
                Order id <strong>{{ order._id }} at {{ order['space-title'] }} with total <i>{{ order['order-price'] }}$</i></strong>
              </h4>
              <h5 class="text-slate-400 text-sm mb-2">
                Ordered at {{ dateFormatter(order['ordered-at']) }}
              </h5>
              <h4 class="text-slate-400 text-sm mb-2">
                Started at {{ dateFormatter(order['order-duration'].startAt) }}
              </h4>
              <small class="text-slate-400 text-sm mb-2">Ended at {{ moment(order['order-duration'].endAt).format('MMMM d, YYYY') }}</small>
              <small
                v-if="order['license-plate']"
                class="text-slate-400 text-sm mb-2"
              >{{ order['license-plate'] }}</small>
              <small :class="order['order-duration'].completed ? 'bg-blue-400 text-white text-sm px-1  w-fit rounded' : ''">{{ order['order-duration'].completed ? 'Completed' : 'Ongoing' }}</small>
              <button class="border-2 border-slate-50 w-fit mt-4 bg-slate-200 text-sm rounded px-1">
                Leave a Review
              </button>
            </div>
            <img
              v-if="order['qr-code']"
              :src="order['qr-code']"
              class="w-1/6 h-full h-full object-cover"
              alt=""
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* Track styles */
::-webkit-scrollbar-track {
  background-color: #E2E8F0;
}

/* Handle styles */
::-webkit-scrollbar-thumb {
  background-color: #4A5568;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}

/* Handle when active (i.e. being dragged) */
::-webkit-scrollbar-thumb:active {
  background-color: #1A202C;
}
</style>
