<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-6 animate-fade-in">
      <h2 class="text-xl font-bold text-red-600">Erreur</h2>
      <p class="text-gray-700">
        {{ message || "Une erreur est survenue. Veuillez réessayer." }}
      </p>
      <div class="flex justify-center gap-4 mt-4">
        <button @click="$emit('close')"
                class="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 transition">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean , message: string}>()
defineEmits(['close'])
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