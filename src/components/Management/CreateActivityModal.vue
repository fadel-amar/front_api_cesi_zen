<template>
  <div v-if="visible" class="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
    @click.stop>
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto pointer-events-auto">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Nouvelle activité</h2>
      <p v-if="globalError" class="text-red-600 text-sm font-medium mb-4">
        {{ globalError }}
      </p>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
          <input id="title" v-model="formData.Title" type="text" maxlength="255"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.Title }" />
          <p v-if="errors.Title" class="text-red-500 text-xs mt-1">{{ errors.Title }}</p>
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" v-model="formData.Description" maxlength="1000"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.Description }" />
          <p v-if="errors.Description" class="text-red-500 text-xs mt-1">{{ errors.Description }}</p>
        </div>
        <div>
          <label for="durationMin" class="block text-sm font-medium text-gray-700">Durée (minutes)</label>
          <input id="durationMin" v-model.number="formData.DurationMin" type="number" min="1" max="120"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.DurationMin }" />
          <p v-if="errors.DurationMin" class="text-red-500 text-xs mt-1">{{ errors.DurationMin }}</p>
        </div>
        <div>
          <label for="imagePresentation" class="block text-sm font-medium text-gray-700">Image de présentation</label>
          <input id="imagePresentation" type="file" accept="image/jpeg, image/png, image/gif, .jpg, .jpeg, .png, .gif"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.ImagePresentation }"
            @change="handleFileChange($event, 'ImagePresentation')" />
          <p v-if="errors.ImagePresentation" class="text-red-500 text-xs mt-1">{{ errors.ImagePresentation }}</p>
        </div>
        <div>
          <label for="url" class="block text-sm font-medium text-gray-700">Contenu</label>
          <input id="url" type="file"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.Url }" @change="handleFileChange($event, 'Url')"
            accept="video/*,.mp4,.mov,.avi,.webm,.mkv" multiple="false" />
          <p v-if="errors.Url" class="text-red-500 text-xs mt-1">{{ errors.Url }}</p>
        </div>
        <div>
          <label for="typeActivitty" class="block text-sm font-medium text-gray-700">Type d'activité</label>
          <select id="typeActivitty" v-model.number="formData.TypeActivitty"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.TypeActivitty }">
            <option value="0" disabled>Sélectionnez un type</option>
            <option v-for="(name, id) in activityTypes" :key="id" :value="id">
              {{ name }}
            </option>
          </select>
          <p v-if="errors.TypeActivitty" class="text-red-500 text-xs mt-1">{{ errors.TypeActivitty }}</p>
        </div>
        <div>
          <label for="categoryId" class="block text-sm font-medium text-gray-700">Catégorie</label>
          <select id="categoryId" v-model.number="formData.CategoryId"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.CategoryId }">
            <option value="0" disabled>Sélectionnez une catégorie</option>
            <option v-for="cat in categories" :key="cat.id" pilihan :value="cat.id">{{ cat.name }}</option>
          </select>
          <p v-if="errors.CategoryId" class="text-red-500 text-xs mt-1">{{ errors.CategoryId }}</p>
        </div>
        <div class="flex justify-center gap-4 mt-6">
          <button type="button" @click="$emit('cancel')" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" class="btn-primary">
            Créer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CategoryResponse } from '../../models/Category';
import activityService from '../../services/ActivityService';
import categoryService from '../../services/categoryService';

const props = defineProps<{
  visible: boolean
  globalError?: string
}>()

const emit = defineEmits(['confirm', 'cancel'])

const formData = ref<{
  Title: string,
  Description: string,
  DurationMin: number,
  ImagePresentation: File | null,
  Url: File | null,
  TypeActivitty: number,
  CategoryId: number
}>({
  Title: '',
  Description: '',
  DurationMin: 1,
  ImagePresentation: null,
  Url: null,
  TypeActivitty: 0,
  CategoryId: 0
})

const errors = ref({
  Title: '',
  Description: '',
  DurationMin: '',
  ImagePresentation: '',
  Url: '',
  TypeActivitty: '',
  CategoryId: ''
})

const categories = ref<CategoryResponse[]>()
const activityTypes = ref<{ [key: number]: string }>({})
const globalError = ref(props.globalError || '')

const fetchCategories = async () => {
  try {
    const allCategories = (await categoryService.getAll()).categories;
    categories.value = allCategories.filter(cat => cat.status === true);
  } catch {
    emit('cancel')
  }
}

const fetchActivityTypes = async () => {
  try {
    const response = await activityService.getTypes()
    activityTypes.value = response
  } catch (e) {
    emit('cancel')
  }
}

const handleFileChange = (event: Event, field: 'ImagePresentation' | 'Url') => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) {
    formData.value[field] = null
    errors.value[field] = `Le fichier est requis.`
    return
  }

  const file = input.files[0]
  const imageTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const videoTypes = ['video/mp4', 'audio/mp3']

  if (field === 'ImagePresentation') {
    if (!imageTypes.includes(file.type)) {
      formData.value[field] = null
      errors.value[field] = 'Seuls les fichiers JPG, JPEG ou PNG sont autorisés pour l’image.'
      return
    }
    errors.value.ImagePresentation = ''
  }

  if (field === 'Url') {
    if (!videoTypes.includes(file.type)) {
      formData.value[field] = null
      errors.value[field] = 'Seuls les fichiers MP4 ou MP3 sont autorisés pour le contenu.'
      return
    }
    errors.value.Url = ''
  }

  formData.value[field] = file
}

const handleSubmit = () => {
  errors.value = {
    Title: '',
    Description: '',
    DurationMin: '',
    ImagePresentation: '',
    Url: '',
    TypeActivitty: '',
    CategoryId: ''
  }
  let hasErrors = false

  if (!formData.value.Title) {
    errors.value.Title = 'Le titre est requis.'
    hasErrors = true
  } else if (formData.value.Title.length > 255) {
    errors.value.Title = 'Le titre ne doit pas dépasser 255 caractères.'
    hasErrors = true
  }

  if (!formData.value.Description) {
    errors.value.Description = 'La description est requise.'
    hasErrors = true
  } else if (formData.value.Description.length > 1000) {
    errors.value.Description = 'La description ne doit pas dépasser 1000 caractères.'
    hasErrors = true
  }

  if (!formData.value.DurationMin || formData.value.DurationMin < 1 || formData.value.DurationMin > 120) {
    errors.value.DurationMin = 'La durée doit être comprise entre 1 et 120 minutes.'
    hasErrors = true
  }

  if (!formData.value.ImagePresentation) {
    errors.value.ImagePresentation = 'L\'image de présentation est requise.'
    hasErrors = true
  }

  if (!formData.value.Url) {
    errors.value.Url = 'Le contenu est requis.'
    hasErrors = true
  }

  if (!formData.value.TypeActivitty || formData.value.TypeActivitty <= 0) {
    errors.value.TypeActivitty = 'Le type d\'activité est requis.'
    hasErrors = true
  }

  if (!formData.value.CategoryId || formData.value.CategoryId <= 0) {
    errors.value.CategoryId = 'La catégorie est requise.'
    hasErrors = true
  }

  if (hasErrors) {
    globalError.value = 'Veuillez corriger les erreurs dans le formulaire';
    return
  }

  const form = new FormData()
  form.append('Title', formData.value.Title)
  form.append('Description', formData.value.Description)
  form.append('DurationMin', formData.value.DurationMin.toString())
  if (formData.value.ImagePresentation) form.append('ImagePresentation', formData.value.ImagePresentation)
  if (formData.value.Url) form.append('Url', formData.value.Url)
  form.append('TypeActivitty', formData.value.TypeActivitty.toString())
  form.append('CategoryId', formData.value.CategoryId.toString())

  emit('confirm', form)
}

onMounted(() => {
  fetchCategories()
  fetchActivityTypes()
})
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