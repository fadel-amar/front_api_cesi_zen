<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main class="flex-grow flex items-center justify-center px-4">
            <form @submit.prevent="handleRegister" class="max-w-md w-full p-6 bg-white rounded-lg shadow-md space-y-6"
                novalidate>
                <h2 class="text-2xl font-semibold text-center text-gray-800">Créer un compte</h2>

                <div>
                    <input v-model="login" type="text" placeholder="Login" :class="inputClass(loginErrors)"
                        autocomplete="login" />
                    <p v-for="(msg, i) in loginErrors" :key="i" class="text-red-500 text-sm mt-1">{{ msg }}</p>
                </div>

                <div>
                    <input v-model="email" type="email" placeholder="Email" :class="inputClass(emailErrors)"
                        autocomplete="email" />
                    <p v-for="(msg, i) in emailErrors" :key="i" class="text-red-500 text-sm mt-1">{{ msg }}</p>
                </div>

                <div class="relative">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Mot de passe"
                        :class="inputClass(passwordErrors)" autocomplete="new-password" />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
                    </button>
                    <p v-for="(msg, i) in passwordErrors" :key="i" class="text-red-500 text-sm mt-1">{{ msg }}</p>
                </div>

                <div class="relative">
                    <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                        placeholder="Confirmer le mot de passe" :class="inputClass(confirmErrors)"
                        autocomplete="new-password" />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        <font-awesome-icon :icon="['fas', showConfirmPassword ? 'eye-slash' : 'eye']" />
                    </button>
                    <p v-for="(msg, i) in confirmErrors" :key="i" class="text-red-500 text-sm mt-1">{{ msg }}</p>
                </div>

                <button type="submit"
                    class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-200">
                    S'inscrire
                </button>

                <p class="text-sm text-center text-gray-600">
                    Vous avez déjà un compte ?
                    <router-link to="/login" class="text-blue-600 hover:underline">
                        Connectez-vous
                    </router-link>
                </p>

                <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
            </form>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '../components/layout/HeaderMobile.vue';
import * as authService from '../services/authService.ts';
import { isValidEmail, isValidPassword } from '../helper/FunctionUtils.ts';
import router from '../router/index.ts';

const login = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref(null);

const loginErrors = ref([]);
const emailErrors = ref([]);
const passwordErrors = ref([]);
const confirmErrors = ref([]);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

function inputClass(errors) {
    return [
        'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition',
        errors.length > 0 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
    ];
}

function clearErrors() {
    loginErrors.value = [];
    emailErrors.value = [];
    passwordErrors.value = [];
    confirmErrors.value = [];
    error.value = null;
}

function validate() {
    clearErrors();

    if (!login.value.trim()) loginErrors.value.push("Le login est obligatoire");

    if (!email.value.trim()) {
        emailErrors.value.push("L'email est obligatoire");
    } else if (!isValidEmail(email.value)) {
        emailErrors.value.push("L'email n'est pas valide");
    }

    if (!password.value.trim()) {
        passwordErrors.value.push("Le mot de passe est obligatoire");
    } else if (!isValidPassword(password.value)) {
        passwordErrors.value.push("Le mot de passe doit contenir au moins 6 caractères, incluant des lettres, des chiffres et des caractères spéciaux");
    }

    if (!confirmPassword.value.trim()) {
        confirmErrors.value.push("La confirmation est obligatoire");
    } else if (confirmPassword.value !== password.value) {
        confirmErrors.value.push("Les mots de passe ne correspondent pas");
    }

    return (
        loginErrors.value.length === 0 &&
        emailErrors.value.length === 0 &&
        passwordErrors.value.length === 0 &&
        confirmErrors.value.length === 0
    );
}

async function handleRegister() {
    clearErrors();
    if (!validate()) return;

    try {
        await authService.register(login.value, email.value, password.value);
        router.push('/profile');
    } catch (e) {
        if (e.response && e.response.status === 400 && e.response.data?.errors) {
            const apiErrors = e.response.data.errors;
            if (apiErrors.Login) loginErrors.value.push(...apiErrors.Login);
            if (apiErrors.Email) emailErrors.value.push(...apiErrors.Email);
            if (apiErrors.Password) passwordErrors.value.push(...apiErrors.Password);
        } else {
            error.value = e.message || "Erreur lors de l'inscription";
        }
    }
}
</script>