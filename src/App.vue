<script setup>
import { defineComponent, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
import draggable from 'vuedraggable'
defineComponent({
  draggable,
  Navigation
})
const items = ref([
  {
    id: 1,
    parkingSpot: 1
  },
  {
    id: 2,
    parkingSpot: 2
  },
  {
    id: 3,
    parkingSpot: 3
  }
])

const addItem = ref(() => {
  items.value.push({id: items.value.length + 1, parkingSpot: items.value.length  + 1})
})
</script>

<template>
  <main class="root">
    <Navigation/>
    <draggable class="root__parking-space" v-model="items" item-key="id" :group="{pull: false, push: false}">
      <template #item="{element}">
        <div class="root__parking-spot">
          <h2>{{element.parkingSpot}}</h2>
        </div>
      </template>
      <template #footer>
        <span @click="addItem">Add</span>
      </template>
    </draggable>
  </main>
</template>

<style scoped>

body{
  margin: 0;
  padding: 0;
  background: aliceblue;
}

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: aliceblue;
  color: #151515;
}

.root{
  border: 2px solid red;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.root__parking-space{
  border: 2px solid red;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  text-align: center;
}

.root__parking-spot{
  border: 2px solid blue;
  height: 240px;
  width: 17%;
}
</style>
