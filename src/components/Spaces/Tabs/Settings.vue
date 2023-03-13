<script setup>
import { ref, reactive, onMounted } from "vue";

const props = defineProps({
  space: {
    type: Object,
    required: true,
    default: () => {}
  }
})

const mutableSpace = reactive(props.space)
const disabledTitle = ref(true)
const disabledAmount = ref(true)

const managers = ref(['john doe', 'veron ibishi', 'alice'])


</script>

<template>
  <form
    id="basic-info"
    class="flex flex-col h-screen py-4 px-6 border-2"
  >
    <div>
      <div class="flex flex-row border-2  items-center">
        <div class=" w-fit mr-4">
          <label
            for="parking-name"
            class="block text-sm font-medium text-gray-700"
          >
            Parking Name
          </label>
          <div class="mt-1 flex flex-row  items-center">
            <input
              id="parking-name"
              v-model="mutableSpace.title"
              :disabled="disabledTitle"
              name="parking-name"
              type="text"
              autocomplete="off"
              required
              class="appearance-none mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
            <font-awesome-icon
              class="ml-3 text-slate-400 w-4 h-4 hover:text-blue-500"
              icon="fa-solid fa-pen"
              @click="disabledTitle = !disabledTitle"
            />
          </div>
        </div>
        <div class="w-fit ml-4">
          <label
            for="parking-name"
            class="block text-sm font-medium text-gray-700"
          >
            Parking Amount
          </label>
          <div class="mt- flex flex-row justify-between items-center">
            <input
              id="parking-name"
              v-model="mutableSpace.amount"
              :disabled="disabledAmount"
              name="parking-name"
              type="number"
              min="1"
              autocomplete="off"
              required
              class="appearance-none mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
            <font-awesome-icon
              class="ml-3 text-slate-400 w-4 h-4 hover:text-blue-500"
              icon="fa-solid fa-pen"
              @click="disabledAmount = !disabledAmount"
            />
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col flex-start justify-start">
        <div class="flex justify-center w-fit mt-4 mb-4">
          <div>
            <input
              id="flexSwitchChecked"
              v-model="mutableSpace.premiumFeatures.analytics"
              class="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 dark:bg-neutral-600 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 dark:after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary dark:checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary dark:checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
              type="checkbox"
              role="switch"
              checked
            >
            <label
              class="inline-block pl-[0.15rem] hover:cursor-pointer"
              for="flexSwitchChecked"
            >Analytics</label>
          </div>
        </div>
        <div class="flex flex-col justify-center w-fit mb-4">
          <div>
            <input
              id="flexSwitchChecked"
              v-model="mutableSpace.premiumFeatures['real-time']"
              class="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 dark:bg-neutral-600 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 dark:after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary dark:checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary dark:checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
              type="checkbox"
              role="switch"
              checked
            >
            <label
              class="inline-block pl-[0.15rem] hover:cursor-pointer"
              for="flexSwitchChecked"
            >Real Time Admission</label>
          </div>
          <div
            v-if="mutableSpace.premiumFeatures['real-time']"
            class="mt-4 mb-4 border-2 border-slate-300 rounded px-4 py-6"
          >
            <div class="w-full mb-4">
              <label
                for="waiting-time"
                class="text-slate-400 text-sm"
              >
                Waiting Time for Admission
              </label>
              <div class="flex flex-row items-center text-center">
                <input
                  id="waiting-time"
                  min="1"
                  max="30"
                  type="number"
                  class="appearance-none mt-1 w-2/6 h-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                <small class="ml-2 pt-1 text-slate-400 text-center">Minutes</small>
              </div>
            </div>
            <div class="w-full flex flex-row items-center">
              <label
                for="waiting-time"
                class="text-slate-400 text-sm mr-2 pt-1"
              >
                Autocomplete
              </label>
              <input
                id="flexSwitchChecked"
                class="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 dark:bg-neutral-600 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 dark:after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary dark:checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary dark:checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                type="checkbox"
                role="switch"
                checked
              >
            </div>
          </div>
        </div>
        <div class="flex justify-center w-fit mb-2">
          <div>
            <input
              id="flexSwitchChecked"
              v-model="mutableSpace.premiumFeatures.messaging"
              class="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 dark:bg-neutral-600 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 dark:after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary dark:checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary dark:checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
              type="checkbox"
              role="switch"
              checked
            >
            <label
              class="inline-block pl-[0.15rem] hover:cursor-pointer"
              for="flexSwitchChecked"
            >SMS Confirmation</label>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <div
          v-for="person in managers"
          :key="person"
        >
          <div>
            {{ person }}
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
