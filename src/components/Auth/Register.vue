<script setup>
import { useRoute } from 'vue-router';
import {onMounted, ref} from 'vue'
import { UserModel } from '../../models/user'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const router = useRoute()
const passwordHidden = ref(true)

const fullName = ref('')
const email = ref('')
const password = ref('')


let errors = ref({
    message: '',
    field: 'as'
})
onMounted(() => { 
    console.log('erorrs',errors.value.field)
})
const register = () => { 
    const user = new UserModel(fullName, email, password)
    createUserWithEmailAndPassword(getAuth(), user.email.value, user.password.value)
        .then(response => {
            console.log('RESPONSE', response.user)
            updateProfile(response.user, {
                displayName: user.fullName.value
            }).then(res => {
                console.log('response update', res)
            })
        })
        .catch(error => {
            console.log('error on register', error.code, error.message)
            if (error.code === 'auth/email-already-in-use') { 
                errors.value = 
                console.log(errors.value)
            } else {
                errors.value = ''
            }
    })
}
</script>


<template>
    <div v-if="router.params.state === 'register'" class="h-fit w-2/4 shadow-lg flex flex-col items-center mb-6">
        <img src="../../assets/Auth/Dalle-Register.png" class="w-64 h-64" alt="">
        <p class="w-3/6 text-4xl pl-7 m-2">Register</p>
        <div class="flex flex-row items-center m-4 justify-center w-3/6">
            <font-awesome-icon icon="fa-solid fa-signature" class="h-4 w-4 text-slate-500"   />
            <input v-model="fullName" type="text" placeholder="Full Name..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none placeholder:text-slate-900">
        </div>
        <div :class="`flex flex-row items-center m-4 justify-center w-3/6 ${errors === 'email' ? 'border-b-2 border-red-500 rounded' : 'border-transparent'}`">
            <font-awesome-icon icon="fa-solid fa-at" :class="`h-4 w-4 ${errors === 'email' ? 'text-red-500' : 'text-slate-500'}`" />
            <input v-model="email" type="mail" placeholder="Email..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none  placeholder:text-slate-900">
        </div>
        <form class="flex flex-row items-center m-4 justify-center w-3/6">
            <font-awesome-icon icon="fa-solid fa-lock" class="h-4 w-4 text-slate-500 ml-2" />
            <input v-model="password" autocomplete="create-password" :type="passwordHidden ? 'password' : 'text'" placeholder="password..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none placeholder:text-slate-900">
            <font-awesome-icon :icon="passwordHidden ? 'fa-solid fa-eye-slash' : 'fa-slod fa-eye'" class="h-4 w-4 text-slate-500 ml-36 pl-2 absolute" @click="passwordHidden = !passwordHidden" />
        </form>
        <div v-if="errors">
            <span v-if="errors" class="text-red-500">{{errors}}</span>
        </div>
        <div class="w-3/6 flex flex-row justify-end m-2">
            <span>
                By signing up, you're agreeing to our 
                <router-link to="/auth/policies" class="text-blue-500">Terms & Conditions</router-link> and
                <router-link to="/auth/policies" class="text-blue-500">Privacy Policy</router-link>
            </span>
        </div>
        <div class="w-3/6 flex flex-col justify-center m-2">
            <button class="bg-blue-500 text-slate-50 rounded-md h-10" @click="register()">Register</button>
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
</div>
</template>
