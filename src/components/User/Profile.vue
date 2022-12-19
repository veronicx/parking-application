<script setup>
import {  ref } from 'vue'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(getAuth(), user => {
      removeListener();
      resolve(user);
    }, reject);
  });
};

const callClick = async () => {  
  console.log(await getCurrentUser(), 'hello')
   
}

const clickMe = ref(() => {  
      callClick()
})
</script>

<template>
    <div>
        <button @click="clickMe"> HELLO</button>
    </div>
</template>