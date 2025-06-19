<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
        <!-- Header -->
        <Header />

        <!-- Main login form -->
        <main class="flex-grow flex items-center justify-center px-4">
            <form @submit.prevent="handleLogin" class="max-w-md w-full p-6 bg-white rounded-lg shadow-md space-y-6"
                novalidate>
                <h2 class="text-2xl font-semibold text-center text-gray-800">Connexion</h2>

                <div>
                    <input v-model="email" type="email" placeholder="Email" :class="[
                        'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
                        emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    ]" autocomplete="email" />
                    <p v-if="emailError" class="text-red-500 text-sm mt-1">L'email est obligatoire</p>
                </div>

                <div>
                    <input v-model="password" type="password" placeholder="Mot de passe" :class="[
                        'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
                        passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    ]" autocomplete="current-password" />
                    <p v-if="passwordError" class="text-red-500 text-sm mt-1">Le mot de passe est obligatoire</p>
                </div>

                <button type="submit"
                    class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-200">
                    Connexion
                </button>
                <p class="text-sm text-center text-gray-600">
                    Pas encore de compte ?
                    <router-link to="/register" class="text-blue-600 hover:underline">
                        Créez un compte
                    </router-link>
                </p>

                <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
            </form>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '../components/layout/Header.vue';
import * as authService from '../services/authService.js';
import router from '../router/index.js';

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
        router.push('/'); 
    } catch (e) {
        error.value = e.message;
    }
}
</script>
