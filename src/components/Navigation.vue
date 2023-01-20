<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import { signOut, getAuth } from 'firebase/auth'

const router = useRouter()
const optionVal = ref('')

const toggleDropdown = ref('hidden')

const handleSignOut = () => {  
    signOut(getAuth()).then(() => { 
        router.push("/")
    })
}

watch(optionVal, (newVal, _oldVal) => {
    if (newVal === '/auth/signout') { 
        handleSignOut() 
        
    }
        if(newVal !== _oldVal) { router.push(newVal) }
})

defineProps({
    auth: { 
        type: Object,
        required: true,
    }
})

</script>


<template>
    <nav class="flex flex-col cursor-pointer justify-between items-center mb-8 p-8  sm:flex-row sm:h-16 shadow-md" @mouseleave="toggleDropdown = 'hidden'">
        <div class="flex flex-col sm:flex-row items-center justify-between w-full sm:w-1/3">
        <span class="uppercase text-2xl flex flex-row justify-between w-full items-center sm:block sm:w-fit">
            Parklace
            <span 
                class="uppercase text-xl sm:hidden ml-4 hover:text-red-500"
            >
             <img @click="toggleDropdown === 'hidden' ? toggleDropdown = 'flex' : toggleDropdown = 'hidden'" src="../assets/hamburger.png" alt="dropdown hover">
            </span>
        </span>
        <div :style="`display:${toggleDropdown}`" class="hidden w-full flex-col text-center m-4 justify-center h-28 sm:h-auto sm:flex sm:flex-row sm:justify-between md:w-fit">
            <span class="m-4" @click="router.push('/home')">
                Home
            </span>
            <span class="m-4" @click="router.push('/about')">
                About
            </span>
            <span class="m-4" @click="router.push('/services')">
                Services
            </span>
            <span v-if="auth.uid" class="m-4" @click="router.push('/spaces')">
                Spaces
            </span>
            <span class="m-4" @click="router.push('/explore')">Explore</span> 
       </div>
       </div>
       <div :style="`display:${toggleDropdown}`" class="hidden mt-8 flex-row sm:flex sm:mt-0">
          <img class="w-8 h-8 border-2 absolute rounded-full  m-auto" src="../assets/avatar.png">
          <select v-model="optionVal" id="select" name="options" class="w-8 h-8 z-20 text-transparent rounded cursor-pointer bg-transparent outline-none appearance-none indent-0 overflow-hidden">
                <option v-if="auth.uid" value="/profile" class="text-slate-900">Profile</option>
                <option v-if="auth.uid" value="/settings" class="text-slate-900">Settings</option>
                <option v-if="auth.uid" value="/auth/signout" class="text-slate-900">Sign Out</option>
                <option v-if="!auth.uid" value="/auth/login" class="text-slate-900">Login</option>
            </select>
       </div>
    </nav>
</template>

