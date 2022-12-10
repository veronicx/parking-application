<script setup>
import { ref } from 'vue'
import Analytics from '../components/User/Analytics.vue';
import Profile from '../components/User/Profile.vue';
// import { UserModel } from '../models/user'

// const firebaseAuth = '.... coming'

// const user = new UserModel()

</script>

<template>
    <div class="flex flex-col items-center">
        <Profile />
        <Analytics />
    </div>
</template>