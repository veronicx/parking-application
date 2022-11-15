<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import Login from '../components/Auth/Login.vue'
import Register from '../components/Auth/Register.vue'
import Forgot from '../components/Auth/Forgot.vue';
import Policies from '../components/Auth/Policies.vue';


const router = ref(useRoute())
</script>

<template>
    <div class="w-full flex flex-col justify-center items-center">
        <Login v-if="router.params.state === 'login'" />
        <Register v-if="router.params.state === 'register'" />
        <Forgot v-if="router.params.state === 'forgot'" />
        <Policies v-if="router.params.state === 'policies'" />
    </div>
</template>