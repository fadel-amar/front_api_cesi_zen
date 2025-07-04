<template>
  <div v-if="visible" class="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
    @click.stop>
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto pointer-events-auto">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Modifier la catégorie</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
          <input id="name" v-model="formData.name" type="text" maxlength="50"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.name }" />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label for="emoji" class="block text-sm font-medium text-gray-700">Emoji</label>
          <emoji-picker class="emoji-picker max-w-full" @emoji-click="handleEmojiSelect"></emoji-picker>
          <p v-if="formData.emoji" class="mt-2 text-sm text-gray-600">Emoji sélectionné : {{ formData.emoji }}</p>
          <p v-if="errors.emoji" class="text-red-500 text-xs mt-1">{{ errors.emoji }}</p>
        </div>
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700">Durée</label>
          <input id="duration" v-model="formData.duration" type="text" maxlength="50"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.duration }" />
          <p v-if="errors.duration" class="text-red-500 text-xs mt-1">{{ errors.duration }}</p>
        </div>
        <div class="flex items-center">
          <input id="status" v-model="formData.status" type="checkbox"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label for="status" class="ml-2 text-sm text-gray-700">Actif</label>
          <p v-if="errors.status" class="text-red-500 text-xs ml-2">{{ errors.status }}</p>
        </div>
        <div class="flex justify-center gap-4 mt-6">
          <button type="button" @click="$emit('cancel')" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" class="btn-primary">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UpdateCategory } from '../../models/Category.ts'

const props = defineProps<{
  visible: boolean
  category: UpdateCategory | null
  apiErrors?: { [key: string]: string[] }
}>()

const emit = defineEmits(['confirm', 'cancel'])

const formData = ref<UpdateCategory>({
  name: '',
  emoji: '',
  duration: '',
  status: true
})

const errors = ref({
  name: '',
  emoji: '',
  duration: '',
  status: ''
})

const durationPattern = /^([1-9]\d*) à ([1-9]\d*) minutes$/;

watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      formData.value = {
        name: newCategory.name || '',
        emoji: newCategory.emoji || '',
        duration: newCategory.duration || '',
        status: newCategory.status !== undefined ? newCategory.status : true
      }
    }
  },
  { immediate: true }
)

watch(
  () => props.apiErrors,
  (newApiErrors) => {
    errors.value = { name: '', emoji: '', duration: '', status: '' }
    if (newApiErrors) {
      if (newApiErrors.Name?.length) errors.value.name = newApiErrors.Name[0]
      if (newApiErrors.Emoji?.length) errors.value.emoji = newApiErrors.Emoji[0]
      if (newApiErrors.Duration?.length) errors.value.duration = newApiErrors.Duration[0]
      if (newApiErrors.Status?.length) errors.value.status = newApiErrors.Status[0]
    }
  },
  { immediate: true }
)

const handleEmojiSelect = (event: CustomEvent) => {
  formData.value.emoji = event.detail.unicode
}

const handleSubmit = () => {
  errors.value = { name: '', emoji: '', duration: '', status: '' }
  let hasErrors = false

  if (formData.value.duration) {
    const match = formData.value.duration.match(durationPattern);

    if (!match) {
      errors.value.duration = 'Le format doit être : "2 à 6 minutes" sans zéros initiaux';
      hasErrors = true;
    } else {
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);

      if (start >= end) {
        errors.value.duration = 'Le premier nombre doit être inférieur au deuxième';
        hasErrors = true;
      }
    }
  }
  
  if (formData.value.emoji && !formData.value.emoji.match(/[\u{1F300}-\u{1F9FF}]/u)) {
    errors.value.emoji = 'Emoji invalide'
    hasErrors = true
  }

  if (formData.value.duration && formData.value.duration.length > 50) {
    errors.value.duration = 'La durée doit avoir moins de 50 caractères'
    hasErrors = true
  }

  if (hasErrors) return

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

emoji-picker {
  --background: #ffffff;
  --border-color: #d1d5db;
  --button-active-background: #3b82f6;
  --button-hover-background: #e5e7eb;
  --input-background-color: #ffffff;
  --input-border-color: #d1d5db;
  --input-border-radius: 0.375rem;
  --input-font-color: #374151;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
}
</style>