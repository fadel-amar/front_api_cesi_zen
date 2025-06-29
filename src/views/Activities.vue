<template>
    <AppLayout>
        <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-20 bg-custom text-gray-900">
            <h1 class="text-2xl sm:text-3xl font-semibold text-center mb-6">🎯 Liste des activités</h1>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <input v-model="searchTerm" type="text" placeholder="Rechercher une activité"
                    class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 shadow-sm focus:ring-2 focus:ring-blue-400" />
                <select v-model="selectedCategory" class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-48">
                    <option value="">Toutes les catégories</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
                <select v-model="selectedType" class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-48">
                    <option value="">Tous les types</option>
                    <option v-for="type in activityTypes" :key="type.id" :value="type.id">{{ type.name }} </option>
                </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <RouterLink v-for="activity in activities" :key="activity.id" :to="`/activities/${activity.id}`"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden block">
                    <img :src="media + activity.imagePresentation" :alt="activity.title"
                        class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <h2 class="text-xl font-semibold mb-1">{{ activity.title }}</h2>
                        <p class="text-sm text-gray-600 mb-1">Type : {{ activity.type }}</p>
                        <p class="text-sm text-gray-600">Catégorie : {{ activity.category }}</p>
                    </div>
                </RouterLink>
            </div>
        </div>
    </AppLayout>

</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import type { ActivityResponse } from '../models/Activity'
import activityService from '../services/ActivityService'
import categoryService from '../services/CategoryService';
import type { CategoryResponse } from '../models/Category';
import { useRoute } from 'vue-router'

const URL_MEDIA: string = import.meta.env.VITE_URL_MEDIA;
const media = `${URL_MEDIA}/`
const route = useRoute()
const activities = ref<ActivityResponse[]>([])
const searchTerm = ref('')
const selectedCategory = ref('')
const selectedType = ref('')
const categories = ref<CategoryResponse[]>([])
const activityTypes = ref<{ id: number; name: string }[]>([])

const fetchActivities = async () => {
    try {
        const result = await activityService.getFiltered({
            title: searchTerm.value || undefined,
            category: selectedCategory.value || undefined,
            typeactivity: selectedType.value || undefined,
        })
        activities.value = result.activities.filter(activity => activity.status === true)

        const resultCategories = await categoryService.getAll();
        categories.value = resultCategories.categories.filter(cat => cat.status === true);
        const typesResponse = await activityService.getTypes();
        activityTypes.value = Object.entries(typesResponse).map(([id, name]) => ({
            id: Number(id),
            name: String(name)
        }))
    } catch (err) {
        console.error('Erreur fetchActivities', err)
    }
}

watch([searchTerm, selectedCategory, selectedType], fetchActivities)

onMounted(() => {
    const catFromUrl = route.query.category as string
    if (catFromUrl) {
        selectedCategory.value = catFromUrl
    }

    fetchActivities()
})
</script>


<style scoped>
select:focus,
input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #A3BFFA;
}
</style>
