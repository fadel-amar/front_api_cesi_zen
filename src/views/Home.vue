<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 text-gray-900 px-4 md:px-16 pb-32 pt-24">
      <!-- Titre de bienvenue -->
      <h1 class="text-4xl md:text-5xl font-semibold text-center mb-12">Bienvenue sur <span
          class="text-blue-600">CesiZen</span></h1>

      <!-- Catégories -->
      <section>
        <h2 class="text-2xl font-medium text-center mb-6">Activités bien-être à explorer</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200">
            <h3 class="text-lg font-semibold">🧘‍♀️ Méditation</h3>
            <p class="text-sm text-gray-500 mt-1">5 à 10 minutes</p>
          </div>
          <div class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200">
            <h3 class="text-lg font-semibold">🧎 Yoga</h3>
            <p class="text-sm text-gray-500 mt-1">10 à 30 minutes</p>
          </div>
          <div class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200">
            <h3 class="text-lg font-semibold">🎧 Sonore</h3>
            <p class="text-sm text-gray-500 mt-1">3 à 5 minutes</p>
          </div>
        </div>
      </section>

      <!-- Activité mise en avant -->
      <section class="mt-14 bg-blue-50 rounded-2xl p-8 border border-blue-200 shadow-sm">
        <h2 class="text-2xl font-medium mb-4">⭐ Activité en vedette</h2>
        <div>
          <h3 class="text-xl font-semibold">Sérénité Express</h3>
          <p class="text-gray-600 text-sm mt-1">Offre-toi une pause zen</p>
          <div class="flex flex-wrap gap-3 mt-4">
            <router-link v-for="activity in activities" :key="activity.id" :to="`/activities/${activity.id}`"
              class="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition">
              {{ activity.title }}
            </router-link>
          </div>
        </div>
      </section>

      <!-- Documents / Ressources -->
      <section class="mt-12">
        <h2 class="text-2xl font-medium text-center mb-6">Documents utiles</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link v-for="page in pages" :key="page.id" :to="`/docs/${page.id}`"
            class="rounded-lg bg-white border border-gray-200 px-6 py-4 shadow-sm hover:shadow-md transition block text-center hover:text-blue-600">
            <h3 class="text-lg font-semibold">{{ page.title }}</h3>
          </router-link>
        </div>
      </section>
    </div>
  </AppLayout>
</template>


<script setup lang="ts">
import AppLayout from '../components/layout/AppLayout.vue'
import { onMounted, ref } from 'vue'
import pageService from '../services/pageService'
import type { PageResponseDTO } from '../models/pageResponse'
import type { ActivityResponse } from '../models/Activity'
import activityService from '../services/ActivityService'

const pages = ref<PageResponseDTO[]>([])
const activities = ref<ActivityResponse[]>([])

onMounted(async () => {
  try {
    const allPages = await pageService.getAll()
    pages.value = allPages.slice(0, 4)
    const topActivities = await activityService.getTopActivities();
    activities.value = topActivities.slice(0, 3)

  } catch (error) {
    console.error('Erreur lors du chargement des pages :', error)
  }
})
</script>
<style scoped></style>