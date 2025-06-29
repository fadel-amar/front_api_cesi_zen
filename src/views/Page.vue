<template>
    <AppLayout>
        <div v-if="page" class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-20 bg-custom text-gray-900">
            <button @click="$router.back()" class="mb-4 text-blue-600 hover:underline">← Retour</button>

            <h1 class="text-3xl font-bold mb-2">{{ page?.title }}</h1>
            <p class="text-gray-500 text-sm mb-4">
                Créée par {{ page.user.username }} le {{ new Date(page.createdAt).toLocaleDateString('fr-FR') }}
            </p>

            <quill-editor v-if="page?.content" v-model:content="page.content" contentType="html"
                :options="editorOptions" class="bg-gray-50 border border-gray-200 p-4 rounded" />
        </div>
        <p v-else class="text-red-500">Aucun contenu disponible pour cette page.</p>

    </AppLayout>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import pageService from '../services/PageService'
import type { FullPageResponse } from '../models/Page'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const route = useRoute()
const page = ref<FullPageResponse>()
const id = Number(route.params.id)

const fetchPage = async () => {
    if (!isNaN(id)) {
        try {
            const result = await pageService.getById(id)
            page.value = result
        } catch (error) {

        }
    }
}
const editorOptions = {
    readOnly: true,
    modules: {
        toolbar: false
    }
}

onMounted(() => {
    fetchPage()
})
</script>
