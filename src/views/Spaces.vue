<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter()
const props = defineProps({
    auth: {
        type: Object,
        required: true,
     }
})

const spaces = ref([])

onMounted(() => {
    fetch(`${import.meta.env.VITE_PARKLACEAPI}/spaces/get/${props.auth.uid}`)
    .then((res) => res.json())
    .then((json) => (spaces.value = json))
})

const generateSpacePanel = (id) => {
    router.push(`/space/panel/${id}`)
}

const deleteSpace = async(id) => {
  try {
    await fetch(`${import.meta.env.VITE_PARKLACEAPI}/spaces/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type' : 'application/json',
      }
    }).then(response => response)
        .then(data => {
          if(data) {

            spaces.value = spaces.value.filter(item => item._id !== id)
          }
        })
  } catch(err) {
    console.log(err)
  }
}

</script>
<template>
  <div v-if="auth.uid">
    <div
      v-if="spaces && spaces.length > 0"
      class="flex flex-col w-full h-fit items-center"
    >
      <div
        v-for="(space,index) in spaces"
        :key="space._id + index"
        class="bg-slate-50 shadow-md rounded m-4 flex flex-col sm:flex-row py-2 text-center justify-between border-2 border-red-500  w-full sm:w-4/6"
      >
        <h2 class="text-xl sm:ml-8 ">
          {{ space.title }}
        </h2>
        <h4 class="text-sm sm:pt-1">
          {{ space.location.locationName }}
        </h4>
        <h3 class="text-sm sm:pt-1">
          {{ space.amount }} Parking Spaces
        </h3>
        <div class="flex flex-row self-end">
          <button
            class="bg-slate-200 rounded px-2 mr-4 text-sm py-1 text-slate-400"
            @click="generateSpacePanel(space._id)"
          >
            View
          </button>
          <button
            class="bg-slate-900 rounded px-2 mr-4 text-sm py-1 text-slate-400"
            @click="generateSpacePanel(space._id)"
          >
            Edit
          </button>
          <button
            class="bg-red-500 text-white rounded px-2 py-1 mr-4 text-sm"
            @click="deleteSpace(space._id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <button
      class="ml-4 bg-slate-50 shadow-md h-8 w-8 rounded-full"
      @click="router.push('/space/new')"
    >
      <font-awesome-icon
        class="text-slate-400 hover:text-slate-900 h-6 w-6"
        icon="fa-solid fa-plus"
      />
    </button>
  </div>
  <span v-else>You have no access to this page.</span>
</template>
