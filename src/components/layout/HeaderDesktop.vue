<template>
    <header
        class="fixed top-0 left-0 right-0 bg-white rounded-b-2xl shadow-md border-b border-gray-200 text-gray-900 flex justify-between items-center px-4 py-3 z-50">
        <router-link to="/" class="flex items-center">
            <img :src="logo" alt="Logo" class="h-16 w-auto" />
        </router-link>

        <div class="flex items-center space-x-8 text-sm font-medium">
            <router-link to="/" class="hover:text-blue-600 transition">
                Accueil
            </router-link>

            <router-link to="/activities" class="hover:text-blue-600 transition">
                Activités
            </router-link>

            <router-link to="/pages" class="hover:text-blue-600 transition">
                Pages
            </router-link>

            <router-link v-if="isLoggedIn && userRole === 'Admin'" to="/admin/dashboard"
                class="hover:text-blue-600 transition">
                Admin
            </router-link>

            <router-link to="/profile"
                class="relative flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 transition duration-200"
                aria-label="Profil">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span v-if="isLoggedIn"
                    class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
            </router-link>
        </div>

        <div class="absolute inset-0 bg-[#A3BFFA] opacity-30 wave-effect"></div>
    </header>
</template>

<style scoped>
.wave-effect {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23A3BFFA" d="M0,128L30,144C60,160,120,192,180,202.7C240,213,300,203,360,186.7C420,171,480,149,540,144C600,139,660,149,720,170.7C780,192,840,224,900,245.3C960,267,1020,277,1080,245.3C1140,213,1200,139,1260,128C1320,117,1380,171,1410,197.3L1440,224L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path></svg>') no-repeat;
    background-size: cover;
    z-index: -1;
}
</style>



<script setup>
import { ref, onMounted } from 'vue';
import * as authService from '../../services/AuthService.ts';
import logo from '@/assets/logo.png'

const isLoggedIn = ref(false);
const userRole = ref('');

onMounted(async () => {
    const { isLoggedIn: logged, role } = await authService.checkAuthStatus();

    if (logged) {
        isLoggedIn.value = true;
        userRole.value = role;
    }
});
</script>
