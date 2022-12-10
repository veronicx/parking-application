<script setup>
import {onMounted, ref} from 'vue'
import userModel from '../../models/user';
const userExample = ref(userModel)

onMounted(() => { 
    const keys = Object.keys(userExample.value)
    keys.forEach(key => {
    userExample.value[`${key}`] = 'johnexam'
})
})
console.log(userExample)
</script>
<template>
    <div class="w-full container shadow-sm shadow-emerald-400 text-slate-900">
        <p class="text-2xl">{{userExample.fullName}}</p>
        <p>{{userExample.email}}</p>
        <p>{{userExample.dateOfBirth}}</p>
    </div>
</template>