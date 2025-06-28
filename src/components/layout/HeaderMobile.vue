<template>
  <footer
    class="fixed bottom-4 left-4 right-4 opacity-70 backdrop-blur-md rounded-2xl shadow-md border border-gray-200 text-gray-900 flex justify-around items-center px-4 py-3 z-50">
    <router-link to="/" class="flex flex-col items-center text-xs hover:text-blue-600 transition" aria-label="Accueil">
      <svg class="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      Accueil
    </router-link>

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
    <router-link v-if="isLoggedIn && userRole === 'Admin'" to="/admin/dashboard"
      class="flex flex-col items-center text-xs hover:text-blue-600 transition" aria-label="Admin">
      <svg class="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.94-1.44a1 1 0 0 1 .26 1.39l-1.06 1.83a1 1 0 0 1-1.39.36l-1.67-.97a7.05 7.05 0 0 1-1.52.88l-.25 1.9a1 1 0 0 1-.99.88h-2.12a1 1 0 0 1-.99-.88l-.25-1.9a7.05 7.05 0 0 1-1.52-.88l-1.67.97a1 1 0 0 1-1.39-.36l-1.06-1.83a1 1 0 0 1 .26-1.39l1.67-.97a7.18 7.18 0 0 1 0-1.76l-1.67-.97a1 1 0 0 1-.26-1.39l1.06-1.83a1 1 0 0 1 1.39-.36l1.67.97c.46-.36.96-.65 1.52-.88l.25-1.9A1 1 0 0 1 11.88 3h2.12a1 1 0 0 1 .99.88l.25 1.9a7.05 7.05 0 0 1 1.52.88l1.67-.97a1 1 0 0 1 1.39.36l1.06 1.83a1 1 0 0 1-.26 1.39l-1.67.97a7.18 7.18 0 0 1 0 1.76l1.67.97z" />
      </svg>
      Admin
    </router-link>

    <router-link to="/profile"
      class="relative flex flex-col items-center text-[11px] font-medium text-gray-600 hover:text-blue-600 transition duration-200"
      aria-label="Profil">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>Profil</span>
      <span v-if="isLoggedIn"
        class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
    </router-link>
  </footer>

</template>


<script setup>
import { ref, onMounted } from 'vue';
import * as authService from '../../services/AuthService.ts';
import router from '../../router/index.ts';
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