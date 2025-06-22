<template>
  <AppLayout>
    <main class="h-[calc(100vh)] bg-gray-50 flex items-center justify-center px-4">
      <form
        @submit.prevent="handleLogin"
        class="max-w-md w-full p-6 bg-white rounded-lg shadow-md space-y-6"
        novalidate
      >
        <h2 class="text-2xl font-semibold text-center text-gray-800">Connexion</h2>

        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            name="email"
            v-model="email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
              emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">L'email est obligatoire</p>
        </div>

        <div class="relative">
          <label for="password" class="sr-only">Mot de passe</label>
          <input
            id="password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Mot de passe"
            autocomplete="current-password"
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition',
              passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            ]"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label="Afficher ou masquer le mot de passe"
          >
            <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
          </button>
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">Le mot de passe est obligatoire</p>
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
        >
          Connexion
        </button>

        <p class="text-sm text-center text-gray-600">
          Pas encore de compte ?
          <router-link to="/register" class="text-blue-600 hover:underline">Créez un compte</router-link>
        </p>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </form>
    </main>
  </AppLayout>
</template>


<script setup>
import { ref } from 'vue';
import * as authService from '../services/authService.ts';
import router from '../router/index.ts';
import AppLayout from '../components/layout/AppLayout.vue';
import HeaderMobile from '../components/layout/HeaderMobile.vue';

const showPassword = ref(false)

const email = ref('');
const password = ref('');
const error = ref(null);

const emailError = ref(false);
const passwordError = ref(false);

function validate() {
    emailError.value = !email.value.trim();
    passwordError.value = !password.value.trim();
    return !emailError.value && !passwordError.value;
}

async function handleLogin() {
    error.value = null;
    if (!validate()) return;
    try {
        await authService.login(email.value, password.value);
        router.push('/profile');
    } catch (e) {
        error.value = e.message;
    }
}
</script>
