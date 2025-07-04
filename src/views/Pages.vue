<template>
    <AppLayout>
        <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-20 bg-custom text-gray-900">
            <h1 class="text-2xl sm:text-3xl font-semibold text-center mb-6">📄 Centre de ressources & documents de
                référence</h1>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <RouterLink v-for="page in pages" :key="page.id" :to="`/pages/${page.id}`"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-5 hover:bg-blue-50 block">
                    <h2 class="text-xl font-semibold mb-2">{{ page.title }}</h2>
                    <p class="text-sm text-gray-600">
                        Créée le : {{ new Date(page.createdAt).toLocaleDateString('fr-FR') }}
                    </p>
                    <p v-if="!page.visibility" class="text-xs text-red-500 mt-1">Non visible</p>
                </RouterLink>
            </div>

            <div v-if="error" class="mt-6 text-center text-red-500">{{ error }}</div>
        </div>
    </AppLayout>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import pageService from '../services/pageService'
import type { PageResponse } from '../models/Page'

const pages = ref<PageResponse[]>([])
const error = ref<string | null>(null)

const fetchPages = async () => {
    try {
        const result = await pageService.getAll()
        pages.value = result.filter(page => page.visibility === true)
    } catch (err) {
        error.value = 'Erreur lors du chargement des pages.'
    } finally {
    }
}

onMounted(() => {
    fetchPages()
})
</script>
<style scoped>
.bg-custom {
    background-color: #f0f4f8;
}
</style>
