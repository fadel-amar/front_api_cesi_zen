<template>
    <AppLayout>
        <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-20 bg-custom text-gray-900">
            <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
                <h1 class="text-2xl sm:text-3xl font-semibold mb-6 text-center">➕ Nouvelle page</h1>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div>
                        <input v-model="form.title" type="text" class="form-input" placeholder="Titre de la page" />
                        <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
                    </div>

                    <div>
                        <QuillEditor v-model:content="form.content" contentType="html" theme="snow"
                            class="bg-white border rounded" style="min-height: 250px" />
                        <p v-if="errors.content" class="text-red-600 text-sm mt-1">{{ errors.content }}</p>
                    </div>

                    <div class="flex justify-end gap-4 pt-4">
                        <RouterLink to="/admin/pages" class="btn-secondary">Annuler</RouterLink>
                        <button type="submit" class="btn-primary">Créer</button>
                    </div>

                    <p v-if="globalError" class="text-red-600 text-sm mt-2">{{ globalError }}</p>
                </form>
            </div>
        </div>
        <SuccessModal :visible="showSuccessModal" :message="successMessage" @close="handleModalClose" />
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import type { CreatePage } from '../models/Page'
import SuccessModal from '../components/SuccessModal.vue'
import pageService from '../services/pageService'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'



const router = useRouter()
const showSuccessModal = ref(false)
const successMessage = ref('Page créée avec succès !')
const globalError = ref('')
const errors = ref({
    title: '',
    content: '',
})

const form = ref<CreatePage>({
    title: '',
    content: '',
})


const handleSubmit = async () => {
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

    const payload: Partial<CreatePage> = {
        title: form.value.title.trim(),
        content: form.value.content.trim(),
    }

    try {
        const response = await pageService.create(payload)
        if (response.status === 201) {
            showSuccessModal.value = true
        } else {
            globalError.value = 'Erreur inconnue lors de la création.'
        }
    } catch (err: any) {
        console.log(err)
        globalError.value = err.response?.data?.errors[0] ?? err?.response?.data?.message ?? 'Erreur inattendue.'
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
