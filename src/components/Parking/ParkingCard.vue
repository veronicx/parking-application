<script setup>
import {onMounted, ref} from 'vue'
const props = defineProps({
    parking: { type: Object, required:true}
})

let attr = ref({})

defineEmits(['close', 'submit'])

onMounted(() => {
    attr.value = props.parking
})
</script>

<template>
     <div class="container bg-slate-400 m-8 flex flex-col items-center rounded-lg w-fit text-slate-200">
            <div id="header" class="bg-slate-700 w-full text-center p-2 border-b-2 rounded">
                <p class="text-2xl">Parking Space</p>
            </div>
            <div class="w-full flex flex-row justify-evenly items-center m-6">
               <div class="flex flex-col">
                    <div>
                        <label for="parking__name" class="block mb-2 text-sm font-medium dark:text-gray-300">Parking Name</label>
                        <input v-model="attr.name"  type="text" id="parking__name" class="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Parking Name..." required>
                    </div>
                    <div>
                        <label for="parking__manager" class="block mb-2 text-sm font-medium dark:text-gray-300">Parking Manager</label>
                        <input v-model="attr.managers" type="text" id="parking__managaer" class="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Parking Managers..." required>
                    </div>
                    <label for="analytics-toggle" class="inline-flex relative items-center cursor-pointer mt-4">
                        <input v-model="attr.analytics" type="checkbox" value="true" id="analytics-toggle" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-slate-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-500"></div>
                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Analytics</span>
                    </label>
                    <label for="online-ordering" class="inline-flex relative items-center cursor-pointer mt-4">
                        <input v-model="attr.remorder" type="checkbox" value="true" id="online-ordering" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-slate-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-500"></div>
                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Remote Ordering</span>
                    </label>
               </div>
               <!-- will be replaced with google module -->
               <div class="p-28 m-2 h-12 w-20 bg-slate-200 rounded text-red-200 textl-4" />
            </div>
           <div id="footer" class="w-full flex flex-row p-6 items-center justify-end bg-slate-700 rounded">
                <button class="w-20 h-8 bg-slate-900 mr-2 rounded" @click="$emit('close', false)">Close</button>
                <button class="w-20 h-8 bg-emerald-300 ml-2 rounded" @click="$emit('submit', attr)">Add</button>
            </div>
        </div>
</template>