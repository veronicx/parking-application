<script setup>
import { useRoute } from 'vue-router';
import {ref, watch} from 'vue'
import {ThrowFirebaseErrors, ThrowAuthErrors } from '../../models/index'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const router = useRoute()
const passwordHidden = ref(true)



const errors = ref([])

const user = ref({
    fullName: '',
    email: '',
    password: ''
})

const register = () => { 
    createUserWithEmailAndPassword(getAuth(), user.value.email, user.value.password)
        .then(response => {
            updateProfile(response.user, {
                displayName: user.value.fullName
            }).then(res => {
                console.log('response update', res)
            })
        })
        .catch(error => {
            const fireBaseError = new ThrowFirebaseErrors(error).message()
            errors.value.push(fireBaseError)

    })
}


const checkData = (fullName,email,password) => { 
    const currentErrors = new ThrowAuthErrors(fullName, email,password).throwWarnings()
    errors.value = currentErrors
}

watch(user.value, (currentValue) => {
    checkData(currentValue.fullName, currentValue.email,currentValue.password)
})

</script>


<template>
    <div v-if="router.params.state === 'register'" class="h-fit w-2/4 shadow-lg flex flex-col items-center mb-6">
        <img src="../../assets/Auth/Dalle-Register.png" class="w-64 h-64" alt="">
        <p class="w-3/6 text-4xl pl-7 m-2">Register</p>
        <div class="flex flex-row items-center m-4 justify-center w-3/6">
            <font-awesome-icon icon="fa-solid fa-signature" class="h-4 w-4 text-slate-500"   />
            <input v-model="user.fullName" minlength="3" maxlength="250" type="text" placeholder="Name..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none placeholder:text-slate-900">
        </div>
        <div :class="`flex flex-row items-center m-4 justify-center w-3/6 ${errors.find(item => item.field === 'email')? 'border-b-2 border-red-500 rounded' : 'border-transparent'}`">
            <font-awesome-icon icon="fa-solid fa-at" :class="`h-4 w-4 ${errors.find(item => item.field === 'email') ? 'text-red-500' : 'text-slate-500'}`" />
            <input v-model="user.email" type="mail" minlength="3" maxlength="250" placeholder="Email..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none  placeholder:text-slate-900">
        </div>
        <form :class="`flex flex-row items-center m-4 justify-center w-3/6 ${errors.field === 'password' ? 'border-b-2 border-red-500 rounded' : 'border-transparent'}`">
            <font-awesome-icon icon="fa-solid fa-lock" :class="`h-4 w-4 ${errors.field === 'password' ? 'text-red-500' : 'text-slate-500'}`" />
            <input v-model="user.password" autocomplete="create-password" minlength="6" maxlength="32" :type="passwordHidden ? 'password' : 'text'" placeholder="password..." class="bg-slate-50 w-3/4 ml-2 rounded  outline-none placeholder:text-slate-900">
            <font-awesome-icon :icon="passwordHidden ? 'fa-solid fa-eye-slash' : 'fa-slod fa-eye'" class="h-4 w-4 text-slate-500 ml-36 pl-2 absolute" @click="passwordHidden = !passwordHidden" />
        </form>
        <div v-if="errors">
            <div v-for="error in errors" :key="error.field">
                <span v-if="error && error.message" class="text-red-500">{{error.message}}</span>
            </div>
        
        </div>
        <div class="w-3/6 flex flex-row justify-end m-2">
            <span>
                By signing up, you're agreeing to our 
                <router-link to="/auth/policies" class="text-blue-500">Terms & Conditions</router-link> and
                <router-link to="/auth/policies" class="text-blue-500">Privacy Policy</router-link>
            </span>
        </div>
        <div class="w-3/6 flex flex-col justify-center m-2">
            <button :disabled="errors && errors.length > 0" class="bg-blue-500 text-slate-50 disabled:bg-blue-300 rounded-md h-10" @click="register()">Register</button>
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
