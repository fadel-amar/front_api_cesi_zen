<template>
    <AppLayout>
        <main class="mt-15 flex-grow px-4 py-10 sm:px-6 md:px-12 bg-gray-50 flex items-center justify-center">
            <div
                class="w-full max-w-7xl p-8 bg-white rounded-2xl shadow-lg space-y-10 pb-20 sm:p-10 sm:rounded-3xl sm:shadow-xl relative">

                <div class="absolute top-4 right-6 z-auto">
                    <button @click="logout"
                        class="text-white text-lg bg-red-500 p-2 rounded-full hover:bg-red-600 transition relative group"
                        aria-label="Se déconnecter">
                        <font-awesome-icon :icon="['fas', 'right-from-bracket']" />

                        <span class="absolute -top-9 right-1/2 translate-x-1/2 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100
             transition bg-black text-white text-xs px-2 py-1 rounded shadow z-50">
                            Se déconnecter
                        </span>
                    </button>
                </div>

                <h1 class="text-3xl font-extrabold text-gray-800 text-center">Mon Profil</h1>

                <div class="space-y-3">
                    <p class="text-gray-700"><strong>Email :</strong> {{ user.email }}</p>
                    <p class="text-gray-700"><strong>Login :</strong> {{ user.login }}</p>
                    <p class="text-gray-700"><strong>Rôle :</strong> {{ user.role }}</p>
                    <p class="text-gray-500 text-sm"><strong>Créé le :</strong> {{ new
                        Date(user.createdAt).toLocaleDateString() }}</p>
                    <p class="text-gray-500 text-sm"><strong>Mis à jour :</strong> {{ new
                        Date(user.updatedAt).toLocaleDateString() }}</p>
                </div>

                <!-- Modifier le login -->
                <section>
                    <h2 class="text-xl font-semibold mb-3 text-gray-700">Modifier le nom d'utilisateur</h2>
                    <form @submit.prevent="updateLogin" class="space-y-3">
                        <input v-model="newLogin" type="text" placeholder="Nouveau login"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-300" />
                        <p v-for="(msg, i) in loginErrors" :key="i" class="text-red-500 text-sm mt-1">{{ msg }}</p>
                        <button type="submit" class="w-full bg-blue-400 text-white font-semibold py-3 rounded-xl
         shadow-md hover:bg-blue-500 active:scale-95 transition-transform duration-150
         lg:py-2 lg:text-sm cursor-pointer">
                            Enregistrer
                        </button>
                        <p v-if="loginMessage" class="text-center text-sm mt-1"
                            :class="{ 'text-green-600': loginSuccess, 'text-red-600': !loginSuccess }">
                            {{ loginMessage }}
                        </p>
                    </form>
                </section>

                <!-- Modifier le mot de passe -->
                <section>
                    <h2 class="text-xl font-semibold mb-3 text-gray-700">Changer le mot de passe</h2>
                    <form @submit.prevent="changePassword" class="space-y-3 relative">
                        <div class="relative">
                            <input :type="showOldPassword ? 'text' : 'password'" v-model="oldPassword"
                                autocomplete="current-password" placeholder="Ancien mot de passe"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 transition duration-300" />
                            <button type="button" @click="showOldPassword = !showOldPassword"
                                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                                :aria-label="showOldPassword ? 'Masquer mot de passe' : 'Afficher mot de passe'">
                                <font-awesome-icon :icon="['fas', showOldPassword ? 'eye-slash' : 'eye']" />
                            </button>
                        </div>

                        <!-- Nouveau mot de passe -->
                        <div class="relative">
                            <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword"
                                autocomplete="new-password" placeholder="Nouveau mot de passe"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 transition duration-300" />
                            <button type="button" @click="showNewPassword = !showNewPassword"
                                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                                :aria-label="showNewPassword ? 'Masquer mot de passe' : 'Afficher mot de passe'">
                                <font-awesome-icon :icon="['fas', showNewPassword ? 'eye-slash' : 'eye']" />
                            </button>
                        </div>

                        <!-- Confirmation -->
                        <div class="relative">
                            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                                autocomplete="new-password" placeholder="Confirmer le nouveau mot de passe"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 transition duration-300" />
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                                :aria-label="showConfirmPassword ? 'Masquer mot de passe' : 'Afficher mot de passe'">
                                <font-awesome-icon :icon="['fas', showConfirmPassword ? 'eye-slash' : 'eye']" />
                            </button>
                        </div>
                        <p v-for="(msg, i) in passwordErrors" :key="i" class="text-red-500 text-sm mt-1">{{ msg }}
                        </p>
                        <button type="submit" class="w-full bg-green-400 text-white font-semibold py-3 rounded-xl
         shadow-md hover:bg-green-500 active:scale-95 transition-transform duration-150
         lg:py-2 lg:text-sm cursor-pointer">
                            Changer
                        </button>
                        <p v-if="passwordMessage" class="text-center text-sm mt-1"
                            :class="{ 'text-green-600': passwordSuccess, 'text-red-600': !passwordSuccess }">
                            {{ passwordMessage }}
                        </p>
                    </form>
                </section>

                <!-- Suppression de compte -->
                <section>
                    <h2 class="text-xl font-semibold mb-3 text-red-500">Supprimer le compte</h2>
                    <p class="text-sm text-gray-500 mb-4 text-center">
                        Cette action est irréversible.
                    </p>
                    <button @click="confirmDelete" class="w-full bg-red-400 text-white font-semibold py-3 rounded-xl
         shadow-md hover:bg-red-500 active:scale-95 transition-transform duration-150
         lg:py-2 lg:text-sm cursor-pointer">
                        Supprimer mon compte
                    </button>
                </section>

                <p v-if="generalError" class="text-red-500 text-center text-sm">{{ generalError }}</p>
            </div>
            <SuccessModal :visible="showSuccessModal" :message="modalMessage" @close="showSuccessModal = false" />
            <ConfirmDeleteModal :visible="showConfirmModal"
                message="Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible."
                @cancel="showConfirmModal = false" @confirm="handleDeleteConfirmed" />
        </main>
    </AppLayout>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SuccessModal from '../components/SuccessModal.vue'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue'
import router from '../router'
import * as authService from '../services/AuthService'
import * as userService from '../services/UserService'
import AppLayout from '../components/layout/AppLayout.vue'



const showSuccessModal = ref(false)
const user = ref<any>({})
const newLogin = ref('')
const loginMessage = ref('')
const loginSuccess = ref(false)
const loginErrors = ref<string[]>([])

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordMessage = ref('')
const passwordSuccess = ref(false)
const passwordErrors = ref<string[]>([])
const generalError = ref('')
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showConfirmModal = ref(false)

let modalMessage: string = 'Mise à jour réussie !'

onMounted(async () => {
    try {
        user.value = await userService.getCurrentUser()
        newLogin.value = user.value.login
    } catch (e) {
        generalError.value = 'Erreur de chargement du profil'
    }
})

async function updateLogin() {
    loginErrors.value = []
    loginMessage.value = ''
    loginSuccess.value = false

    try {
        await userService.updateLoginUser(newLogin.value)
        modalMessage = "Ton login a été mis à jour avec succès !"
        showSuccessModal.value = true
        user.value.login = newLogin.value
    } catch (e: any) {
        const errors = e?.data?.errors || e?.response?.data?.errors
        if (errors?.Login) {
            loginErrors.value.push(...errors.Login)
        } else {
            loginMessage.value = e.message || 'Erreur lors de la mise à jour du login'
        }
    }
}

async function changePassword() {
    passwordMessage.value = ''
    passwordSuccess.value = false
    passwordErrors.value = []

    if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        passwordMessage.value = 'Tous les champs sont requis.'
        return
    }

    if (newPassword.value !== confirmPassword.value) {
        passwordMessage.value = 'Les mots de passe ne correspondent pas.'
        return
    }

    try {
        await userService.resetPassword(oldPassword.value, newPassword.value)
        modalMessage = "Ton mot de passe a été changé avec succès !"
        showSuccessModal.value = true
        oldPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
    } catch (e: any) {
        if (e.response?.data?.errors?.NewPassword) {
            passwordErrors.value = e.response.data.errors.NewPassword
        } else if (e.response?.data?.message) {
            passwordMessage.value = e.response.data.message
        } else {
            passwordMessage.value = e.message || 'Erreur changement mot de passe'
        }
        passwordSuccess.value = false
    }
}

function confirmDelete() {
    showConfirmModal.value = true
}

async function logout() {
    try {
        await authService.logout()
        router.push('/login')
    } catch (e: any) {
        generalError.value = e.message || 'Erreur déconnexion'
    }
};


async function handleDeleteConfirmed() {
    try {
        await userService.deleteAccount()
        authService.logout()
        router.push('/login')
    } catch (e: any) {
        generalError.value = e.message || 'Erreur suppression compte'
    }
}
</script>
