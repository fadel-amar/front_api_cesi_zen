<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 text-gray-900 flex justify-around items-center px-2 py-2 z-50">
    <a href="#" class="flex flex-col items-center text-xs hover:text-blue-600 transition" aria-label="Accueil">
      <svg class="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      Accueil
    </a>

    <a href="#" class="flex flex-col items-center text-xs hover:text-blue-600 transition" aria-label="Activités">
      <svg class="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Activités
    </a>

    <a href="#" class="flex flex-col items-center text-xs hover:text-blue-600 transition" aria-label="Documentation">
      <svg class="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M8 16h8M8 12h8m-6-8h6a2 2 0 012 2v12a2 2 0 01-2 2h-6a2 2 0 01-2-2V6a2 2 0 012-2z" />
      </svg>
      Docs
    </a>

    <a href="#"
      class="relative flex flex-col items-center text-[11px] font-medium text-gray-600 hover:text-blue-600 transition duration-200"
      aria-label="Profil">
      <!-- Icône profil utilisateur -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>Profil</span>

      <!-- Pastille verte quand connecté -->
      <span v-if="isLoggedIn"
        class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
    </a>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as authService from '../../services/authService.js';

const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = authService.isAuthenticated();
});
</script>