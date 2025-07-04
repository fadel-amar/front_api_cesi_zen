<template>
    <AppLayout>
        <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-20 bg-custom text-gray-900">
            <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
                <h1 class="text-2xl sm:text-3xl font-semibold mb-6 text-center">✏️ Modifier la page</h1>
                <div class="text-sm text-gray-600 mb-4">
                    Créée le <strong>{{ new Date(form.createdAt).toLocaleString('fr-FR') }}</strong>
                    <br />
                    Dernière Modification aporté par <strong>{{ form.user.username }}</strong>
                </div>

                <form @submit.prevent="handleUpdate" class="space-y-6">
                    <div>
                        <input v-model="form.title" type="text" class="form-input" placeholder="Titre de la page" />
                        <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
                    </div>

                    <div>
                        <QuillEditor v-model:content="form.content" contentType="html" theme="snow"
                            class="bg-white border rounded" style="min-height: 250px" />
                        <p v-if="errors.content" class="text-red-600 text-sm mt-1">{{ errors.content }}</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Visibilité</label>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" v-model="form.visibility"
                                class="form-checkbox h-4 w-4 text-blue-600" />
                            <span class="text-sm text-gray-800">
                                Visible
                            </span>
                        </div>
                    </div>

                    <div class="flex justify-end gap-4 pt-4">
                        <RouterLink to="/admin/pages" class="btn-secondary">Annuler</RouterLink>
                        <button type="submit" class="btn-primary">Enregistrer</button>
                    </div>

                    <p v-if="globalError" class="text-red-600 text-sm mt-2">{{ globalError }}</p>
                </form>
            </div>
        </div>
        <SuccessModal :visible="showSuccessModal" :message="successMessage" @close="handleModalClose" />
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import type { FullPageResponse, UpdatePage } from '../models/Page'
import SuccessModal from '../components/SuccessModal.vue'
import pageService from '../services/pageService'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const route = useRoute()
const router = useRouter()
const pageId = Number(route.params.id)

const showSuccessModal = ref(false)
const successMessage = ref('Page mise à jour avec succès !')
const globalError = ref('')
const errors = ref({
    title: '',
    content: '',
    link: ''
})


const form = ref<FullPageResponse>({
    id: 0,
    Title: '',
    title: '',
    content: '',
    visibility: true,
    videoLink: '',
    createdAt: '',
    user: {
        id: 0,
        username: ''
    }
})

onMounted(async () => {
    try {
        const response = await pageService.getById(pageId)
        form.value = response
    } catch (err: any) {
        globalError.value = err.response?.data?.errors?.[0] ?? err?.response?.data?.message ?? "Impossible de charger la page."
        console.error(err)
    }
})

const handleUpdate = async () => {
    globalError.value = ''
    errors.value.title = ''
    errors.value.content = ''

    let valid = true

    if (!form.value.title.trim()) {
        errors.value.title = 'Le titre est requis.'
        valid = false
    }
    if (!form.value.content.trim()) {
        errors.value.content = 'Le contenu est requis.'
        valid = false
    }

    if (!valid) return

    const payload: UpdatePage = {
        title: form.value.title.trim(),
        content: form.value.content.trim(),
        visibility: form.value.visibility
    }

    try {
        const response = await pageService.update(pageId, payload)
        if (response.status === 200) {
            showSuccessModal.value = true
        } else {
            globalError.value = 'Erreur inconnue lors de la mise à jour.'
        }
    } catch (err: any) {
        console.log(err)
        globalError.value = err.response?.data?.errors?.[0] ?? err?.response?.data?.message ?? 'Erreur inattendue.'
    }
}

const handleModalClose = () => {
    showSuccessModal.value = false
    router.push('/admin/pages')
}
</script>

<style scoped>
.form-input,
.form-textarea {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f6;
}

.btn-primary {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.btn-secondary {
    background-color: #e5e7eb;
    color: #1f2937;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.bg-custom {
    background-color: #f9fafb;
}
</style>
