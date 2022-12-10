<script setup>
import { ref } from 'vue'
import Analytics from '../components/User/Analytics.vue';
import Profile from '../components/User/Profile.vue';
import userModel from '../models/user'
const user = ref(userModel)
</script>

<template>
    <div class="flex flex-col items-center">
        <Profile />
        <Analytics />
    </div>
</template>