<template>
    <AppLayout>
        <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-10 bg-custom text-gray-900">
            <h1 class="text-2xl sm:text-3xl font-semibold text-center mb-6">📝 Modifier une activité</h1>
            <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Titre</label>
                        <input v-model="form.title" type="text" class="form-input" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea v-model="form.description" class="form-textarea"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Durée (minutes)</label>
                        <input v-model.number="form.durationMin" type="number" min="1" max="120" class="form-input" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Image de présentation</label>
                        <div v-if="currentImage" class="mb-4">
                            <p class="text-sm text-gray-500 mb-2">Image actuelle :</p>
                            <img :src="currentImage" class="max-w-xs max-h-40 object-contain border rounded" />
                        </div>
                        <input type="file" accept="image/*" @change="handleFileChange($event, 'imagePresentation')"
                            class="form-input" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Contenu</label>
                        <div v-if="currentVideo" class="mb-4">
                            <p class="text-sm text-gray-500 mb-2">Vidéo actuelle :</p>
                            <video controls class="max-w-xs max-h-40 border rounded">
                                <source :src="currentVideo" type="video/mp4">
                                Votre navigateur ne supporte pas la lecture de vidéos.
                            </video>
                        </div>
                        <input type="file" accept="video/*" @change="handleFileChange($event, 'url')"
                            class="form-input" />
                    </div>

                    <select v-model.number="form.typeActivitty" class="form-input">
                        <option value="0" disabled>Sélectionnez un type</option>
                        <option v-for="type in activityTypes" :key="type.id" :value="type.id">
                            {{ type.name }}
                        </option>
                    </select>

                    <select v-model.number="form.categoryId" class="form-input">
                        <option value="0" disabled>Sélectionnez une catégorie</option>
                        <option v-for="cat in categories" :key="cat.id" pilihan :value="cat.id">{{ cat.name }}</option>
                    </select>

                    <div class="flex items-center">
                        <input v-model="form.status" type="checkbox" id="status"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label for="status" class="ml-2 block text-sm text-gray-700">Activité active</label>
                    </div>

                    <div class="flex justify-end gap-4 pt-4">
                        <RouterLink to="/admin/activities" class="btn-secondary">Annuler</RouterLink>
                        <button type="submit" class="btn-primary">Sauvegarder</button>
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

import type { UpdateActivity } from '../models/Activity'
import type { CategoryResponse } from '../models/Category'
import activityService from '../services/ActivityService'
import categoryService from '../services/CategoryService'
import SuccessModal from '../components/SuccessModal.vue'
const URL_MEDIA: string = import.meta.env.VITE_URL_MEDIA;

const route = useRoute()
const router = useRouter()
const activityId = Number(route.params.id)

const form = ref<UpdateActivity>({
    title: '',
    description: '',
    durationMin: 1,
    imagePresentation: null,
    url: null,
    typeActivitty: 0,
    categoryId: 0,
    status: true
})

const currentImage = ref('')
const currentVideo = ref('')
const activityTypes = ref<{ id: number; name: string }[]>([])
const categories = ref<CategoryResponse[]>([])
const globalError = ref('')
const showSuccessModal = ref(false)
const successMessage = ref("L'activité a bien été modifiée.")

const fetchData = async () => {
    try {
        const typesResponse = await activityService.getTypes()
        activityTypes.value = Object.entries(typesResponse).map(([id, name]) => ({
            id: Number(id),
            name: String(name)
        }))
        categories.value = (await categoryService.getAll()).categories;

        const data = await activityService.getById(activityId)

        const matchedType = activityTypes.value.find((t: { id: number; name: string }) => t.name === data.type)
        const matchedCategory = categories.value.find((c: CategoryResponse) => c.name === data.category)

        form.value = {
            title: data.title ?? '',
            description: data.description ?? '',
            durationMin: data.durationMin ?? 1,
            imagePresentation: null,
            url: null,
            typeActivitty: matchedType?.id ?? 0,
            categoryId: matchedCategory?.id ?? 0,
            status: data.status ?? true
        }

        if (data.imagePresentation) {
            currentImage.value = `${URL_MEDIA}${data.imagePresentation}`
        }
        if (data.url) {
            currentVideo.value = `${URL_MEDIA}${data.url}`
        }

    } catch (e) {
        globalError.value = "Erreur lors du chargement des données."
        console.error(e)
    }
}

const handleFileChange = (event: Event, field: 'imagePresentation' | 'url') => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
        form.value[field] = input.files[0]

        const reader = new FileReader()
        reader.onload = (e) => {
            if (field === 'imagePresentation') {
                currentImage.value = e.target?.result as string
            } else {
                currentVideo.value = e.target?.result as string
            }
        }
        reader.readAsDataURL(input.files[0])
    } else {
        form.value[field] = null
    }
}

const handleSubmit = async () => {
    const payload = new FormData()
    payload.append('Title', form.value.title ?? '')
    payload.append('Description', form.value.description ?? '')
    payload.append('DurationMin', String(form.value.durationMin))
    if (form.value.imagePresentation) payload.append('ImagePresentation', form.value.imagePresentation)
    if (form.value.url) payload.append('Url', form.value.url)
    payload.append('TypeActivitty', String(form.value.typeActivitty))
    payload.append('CategoryId', String(form.value.categoryId))
    payload.append('Status', String(form.value.status))

    try {
        const response = await activityService.update(activityId, payload)
        if (response.status === 200) {
            showSuccessModal.value = true
        }
    } catch (err: any) {
        const errors = err?.response?.data?.errors
        globalError.value = Array.isArray(errors) ? errors[0] : (err?.response?.data?.message ?? 'Erreur lors de la mise à jour.')
    }
}

const handleModalClose = () => {
    showSuccessModal.value = false
    router.push('/admin/activities')
}

onMounted(fetchData)
</script>

<style>
.form-input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f6;
}

.form-textarea {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f6;
}

.btn-primary {
    background-color: #2563eb;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background 0.2s;
}

.btn-primary:hover {
    background-color: #1d4ed8;
}

.btn-primary:focus {
    outline: none;
    box-shadow: 0 0 0 2px #2563eb;
}

.btn-secondary {
    background-color: #e5e7eb;
    color: #1f2937;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background 0.2s;
}

.btn-secondary:hover {
    background-color: #d1d5db;
}

.btn-secondary:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6b7280;
}

.bg-custom {
    background-color: #f9fafb;
}

video,
img {
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>