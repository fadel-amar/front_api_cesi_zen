<template>
    <AppLayout>
        <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-20 bg-custom text-gray-900">
            <h1 class="text-2xl sm:text-3xl font-bold text-center mb-6">
                <font-awesome-icon :icon="['fas', 'heart']" style="color: #A3BFFA;" />
                Mes activités favorites
            </h1>

            <div v-if=favorites.length class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <RouterLink v-for="activity in favorites" :key="activity.id" :to="`/activities/${activity.id}`"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden block">
                    <img :src="URL_MEDIA + activity.imagePresentation" :alt="activity.title"
                        class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <h2 class="text-xl font-semibold mb-1">{{ activity.title }}</h2>
                        <p class="text-sm text-gray-600 mb-1">Type : {{ activity.type }}</p>
                        <p class="text-sm text-gray-600">Catégorie : {{ activity.category }}</p>
                    </div>
                </RouterLink>
            </div>

            <p v-else class="text-center text-gray-500 mt-10">Aucune activité favorite enregistrée.</p>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import activityService from '../services/ActivityService'
import type { ActivityResponse } from '../models/Activity'


const favorites = ref<ActivityResponse[]>([])
const URL_MEDIA = import.meta.env.VITE_URL_MEDIA

onMounted(async () => {
    try {
        favorites.value = (await activityService.getFavorites()).activities
    } catch (e) {
        console.error("Erreur lors du chargement des favoris :", e)
    }
})
</script>
