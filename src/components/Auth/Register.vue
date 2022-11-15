<script setup>
import { useRoute } from 'vue-router';
import {ref} from 'vue'
import userModel from '../../models/user';
const router = useRoute()
const passwordHidden = ref(true)
const user = ref(userModel)
</script>


<template>
    <form v-if="router.params.state === 'register'" class="h-fit w-2/4 shadow-lg flex flex-col items-center mb-6">
        <img src="../../assets/Auth/Dalle-Register.png" class="w-64 h-64" alt="">
        <p class="w-3/6 text-4xl pl-7 m-2">Register</p>
        <div class="flex flex-row items-center m-4 justify-center w-3/6">
            <font-awesome-icon icon="fa-solid fa-signature" class="h-4 w-4 text-slate-500"   />
            <input v-model="user.fullName" type="text" placeholder="Full Name..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none placeholder:text-slate-900">
        </div>
        <div class="flex flex-row items-center m-4 justify-center w-3/6">
            <font-awesome-icon icon="fa-solid fa-at" class="h-4 w-4 text-slate-500" />
            <input v-model="user.email" type="mail" placeholder="Email..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none placeholder:text-slate-900">
        </div>
        <div class="flex flex-row items-center m-4 justify-center w-3/6">
            <font-awesome-icon icon="fa-solid fa-lock" class="h-4 w-4 text-slate-500 ml-4 pl-0" />
            <input v-model="user.password" :type="passwordHidden ? 'password' : 'text'" placeholder="password..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none placeholder:text-slate-900">
            <font-awesome-icon :icon="passwordHidden ? 'fa-solid fa-eye-slash' : 'fa-slod fa-eye'" class="h-4 w-4 text-slate-500 relative" @click="passwordHidden = !passwordHidden" />
        </div>
        <div class="flex flex-row items-center m-4 justify-center w-3/6">
            <font-awesome-icon icon="fa-solid fa-calendar-week" class="h-4 w-4 text-slate-500 ml-2"    />
            <input v-model="user.dateOfBirth" type="date" placeholder="Birthday..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none placeholder:text-slate-900">
        </div>
        <div class="w-3/6 flex flex-row justify-end m-2">
            <span>
                By signing up, you're agreeing to our 
                <router-link to="/auth/forgot" class="text-blue-500">Terms & Conditions</router-link> and
                <router-link to="/auth/privacy" class="text-blue-500">Privacy Policy</router-link>
            </span>
        </div>
        <div class="w-3/6 flex flex-col justify-center m-2">
            <button class="bg-blue-500 text-slate-50 rounded-md h-10">Register</button>
            <div class="w-full mt-4 mb-4 text-center">
                <fieldset class="border-t border-slate-500">
                    <legend class="mx-auto px-4 text-slate-500">OR</legend>
                </fieldset>
                <button class="bg-slate-200 text-slate-900 mt-4 rounded-md h-10 w-full">
                    <font-awesome-icon icon="fa-solid fa-g" />
                    Register with Google
                </button>
            </div>
        </div>
            <span class="w-3/6 text-center text-slate-500 mb-6">
                Already Registered?
                <router-link to="/auth/login" class="text-blue-500">Login</router-link>
            </span>
</form>
</template>
<style scoped>
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}
</style>