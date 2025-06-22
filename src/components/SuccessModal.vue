<template>
    <transition name="fade">
        <div v-if="visible" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div
                class="bg-white rounded-2xl shadow-2xl px-6 py-8 max-w-sm w-full text-center space-y-4 animate-fade-in-up">
                <div class="text-green-500 text-5xl">
                    <font-awesome-icon icon="check-circle" />
                </div>
                <h2 class="text-xl font-semibold text-gray-800">Succès</h2>
                <p class="text-gray-600">{{ message }}</p>
                <button @click="$emit('close')" class="mt-4 bg-green-400 text-white font-semibold px-6 py-2 rounded-xl
         shadow-md hover:bg-green-500 active:scale-95 transition-transform duration-150
         text-sm cursor-pointer mx-auto block">
                    OK
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
defineProps<{
    visible: boolean
    message: string
}>()

defineEmits(['close'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes fade-in-up {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out;
}
</style>
