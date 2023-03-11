<script setup>
import Layout from '../components/Spaces/Layout.vue';
import { onMounted, ref } from 'vue';
import {  useRouter } from 'vue-router';
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

</script>
<template>
  <div v-if="auth.uid">
    <Layout>
      <div
        v-if="spaces && spaces.length > 0"
        class="flex flex-row flex-wrap justify-center"
      >
        <div
          v-for="(space,index) in spaces"
          :key="space._id + index"
          class="bg-slate-200 shadow-md m-4 flex flex-col justify-center text-center w-1/6"
          @click="generateSpacePanel(space._id)"
        >
          <h2 class="text-2xl mb-2 mt-4">
            {{ space.title }} {{ space._id }}
          </h2>
          <h3 class="text-lg mb-2">
            {{ space.amount }} Parking Spaces
          </h3>
        </div>
      </div>
      <button @click="router.push('/space/new')">
        New Space
      </button>
    </Layout>
  </div>
  <span v-else>You have no access to this page.</span>
</template>
