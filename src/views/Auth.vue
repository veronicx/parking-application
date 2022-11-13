<script setup>

import { useRoute } from 'vue-router';
const router = useRoute()

import Login from '../components/Auth/Login.vue'
import Register from '../components/Auth/Register.vue';
</script>

<template>
    <div class="w-full flex flex-col justify-center items-center">
        <Login v-if="router.params.state === 'login'" />
        <Register v-if="router.params.state === 'register'" />
    </div>
</template>