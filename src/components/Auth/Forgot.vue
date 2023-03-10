<script setup>
import { ref } from 'vue'

import { UserModel } from '../../helpers/index.js'

const fullName = ref('')
const email = ref('')
const password = ref('')

const user = new UserModel(fullName,email,password)
</script>

<template>
    <form class="h-fit w-fit shadow-lg flex flex-col items-center mb-6 p-16">
        <img src="../../assets/Auth/dalle-lock.png" class="w-64 h-64" alt="">
        <p class="w-4/6 text-4xl pl-7 m-4">Forgot Password?</p>
        <span class="text-slate-400">
            Don't worry it happens to the best of you, Please tell us you're email.
        </span>
        <div class="flex flex-row items-center m-8 justify-center w-3/6">
            <font-awesome-icon icon="fa-solid fa-at" class="h-4 text-slate-500" />
            <input v-model="user.email" type="mail" placeholder="Email..." class="bg-slate-50 w-5/6 ml-2 rounded hover:border-b-2 hover:border-slate-500 outline-none placeholder:text-slate-900">
        </div>
        <div class="w-3/6 flex flex-col justify-center m-8">
            <button class="bg-blue-500 text-slate-50 rounded-md h-10">Submit</button>
        </div>
    </form>
</template>
