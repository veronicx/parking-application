<script setup>
import { ref } from 'vue'
import { useRouter} from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
const router = useRouter()
const passwordHidden = ref(true)
const fullName = ref('')
const email = ref('')
const password = ref('')

const login = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then(response => {
            const previousRoute = localStorage.getItem('PREV_ROUTE')
            if (response && response.user && previousRoute) {
                router.push(previousRoute)
            } else {  
                router.push('/')
            }
        }).catch(error => {
        console.log('error', error.message)
    }) 
}

</script>


<template>
  <div class="h-fit w-2/4 shadow-lg flex flex-col items-center mb-6">
    <img
      src="../../assets/Auth/dalle-generate-login.png"
      class="w-64 h-64"
      alt=""
    >
    <p class="w-3/6 text-4xl pl-7 m-2">
      Login
    </p>
    <div class="flex flex-row items-center m-4 justify-center w-3/6">
      <font-awesome-icon
        icon="fa-solid fa-at"
        class="h-4 text-slate-500"
      />
      <input
        v-model="email"
        type="mail"
        placeholder="Email..."
        class="bg-slate-50 w-3/4 ml-2 rounded hover:border-b-2 hover:border-slate-500 outline-none placeholder:text-slate-900"
      >
    </div>
    <div class="flex flex-row items-center m-4 justify-center w-3/6">
      <font-awesome-icon
        icon="fa-solid fa-lock"
        class="h-4 text-slate-500 ml-5"
      />
      <input
        v-model="password"
        :type="passwordHidden ? 'password' : 'text'"
        placeholder="password..."
        class="bg-slate-50 w-3/4 ml-2 rounded hover:border-b-2 hover:border-slate-500 outline-none placeholder:text-slate-900"
      >
      <font-awesome-icon
        :icon="passwordHidden ? 'fa-solid fa-eye-slash' : 'fa-slod fa-eye'"
        class="h-4 text-slate-500 relative"
        @click="passwordHidden = !passwordHidden"
      />
    </div>
    <div class="w-3/6 flex flex-row justify-end m-2">
      <router-link
        to="/auth/forgot"
        class="text-blue-500"
      >
        Forgot Password?
      </router-link>
    </div>
    <div class="w-3/6 flex flex-col justify-center m-2">
      <button
        class="bg-blue-500 text-slate-50 rounded-md h-10"
        @click="login()"
      >
        Login
      </button>
      <div class="w-full mt-4 mb-4 text-center">
        <fieldset class="border-t border-slate-500">
          <legend class="mx-auto px-4 text-slate-500">
            OR
          </legend>
        </fieldset>
        <button class="bg-slate-200 text-slate-900 mt-4 rounded-md h-10 w-full">
          <font-awesome-icon icon="fa-solid fa-g" />
          Login with Google
        </button>
      </div>
    </div>
    <span class="w-3/6 text-center text-slate-500 mb-6">
      New to Parklace?
      <router-link
        to="/auth/register"
        class="text-blue-500"
      >Register</router-link>
    </span>
  </div>
</template>