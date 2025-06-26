<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-fade-in">
            <h2 class="text-xl font-bold text-gray-800">Modifier l'utilisateur</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Login -->
                <div>
                    <label for="login" class="block text-sm font-medium text-gray-700">Login</label>
                    <input id="login" v-model="formData.login" type="text" maxlength="25"
                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        :class="{ 'border-red-500': errors.login }" />
                    <p v-if="errors.login" class="text-red-500 text-xs mt-1">{{ errors.login }}</p>
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" v-model="formData.email" type="email" maxlength="150"
                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        :class="{ 'border-red-500': errors.email }" />
                    <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
                </div>

                <!-- Role -->
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">Rôle</label>
                    <select id="role" v-model="formData.role"
                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        :class="{ 'border-red-500': errors.role }">
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <p v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</p>
                </div>

                <!-- Disabled -->
                <div class="flex items-center">
                    <input id="disabled" v-model="formData.disabled" type="checkbox"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label for="disabled" class="ml-2 text-sm text-gray-700">Désactivé</label>
                </div>

                <!-- Banned -->
                <div class="flex items-center">
                    <input id="banned" v-model="formData.banned" type="checkbox"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label for="banned" class="ml-2 text-sm text-gray-700">Banni</label>
                </div>

                <!-- Boutons -->
                <div class="flex justify-center gap-4 mt-6">
                    <button type="button" @click="$emit('cancel')"
                        class="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 transition">
                        Annuler
                    </button>
                    <button type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UserResponse } from '../../models/UserResponse.ts'

const { visible, user } = defineProps<{
    visible: boolean
    user: UserResponse | null
}>()

const emit = defineEmits(['confirm', 'cancel'])

const formData = ref({
    login: '',
    email: '',
    role: 'User',
    disabled: false,
    banned: false
})

const errors = ref({
    login: '',
    email: '',
    role: ''
})

// Synchroniser formData avec user lorsque la prop change
watch(
    () => user,
    (newUser) => {
        if (newUser) {
            formData.value = {
                login: newUser.login || '',
                email: newUser.email || '',
                role: newUser.role || 'User',
                disabled: newUser.disabled || false,
                banned: newUser.banned || false
            }
        }
    },
    { immediate: true }
)

const handleSubmit = () => {
    errors.value = { login: '', email: '', role: '' }

    if (formData.value.login && formData.value.login.length > 25) {
        errors.value.login = 'Le login doit avoir moins de 25 caractères'
        return
    }

    if (formData.value.email && formData.value.email.length > 150) {
        errors.value.email = "L'email doit avoir moins de 150 caractères"
        return
    }

    if (!['User', 'Admin'].includes(formData.value.role)) {
        errors.value.role = "Le rôle doit être soit 'User' soit 'Admin'"
        return
    }

    emit('confirm', { ...formData.value })
}
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}
</style>