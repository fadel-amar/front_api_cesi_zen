<template>
    <AppLayout>
        <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-20 bg-custom text-gray-900">
            <div v-if="!isPlaying && activity" class="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
                <img :src="media + activity.imagePresentation" :alt="activity.title"
                    class="w-full h-64 object-cover object-top" />
                <div class="p-6">
                    <h1 class="text-3xl font-semibold mb-2">{{ activity.title }}</h1>
                    <p class="text-gray-600 mb-4">Type : {{ activity.type }} | Catégorie : {{ activity.category }}</p>

                    <div class="flex gap-4 mb-6">
                        <button @click="toggleFavorite" :class="[
                            'px-4 py-2 rounded-md font-medium transition',
                            isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-800'
                        ]">
                            ⭐
                        </button>

                        <button @click="tooggleLater" :class="[
                            'px-4 py-2 rounded-md font-medium transition',
                            isLater ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-800'
                        ]">
                            ⏰
                        </button>
                        <router-link to="/activities" class="text-blue-600 hover:underline ml-auto">
                            ← Retour
                        </router-link>
                    </div>

                    <button @click="startActivity" class="btn-primary w-full">Lancer l’activité</button>
                </div>
            </div>

            <div v-if="isPlaying && activity?.url && getMediaType(activity.url) !== 'invalid'"
                class="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 transition-fade show">

                <h2 class="text-4xl font-bold mb-4 text-white animate-pulse">Activité en marche</h2>

                <video v-if="getMediaType(activity.url) === 'video'" ref="videoRef" :controls="isIntroPlaying"
                    class="max-w-full max-h-[70vh] rounded-lg shadow-lg scale-in">
                    <source :src="media + activity.url" type="video/mp4" />
                </video>

                <audio v-else-if="getMediaType(activity.url) === 'audio'" ref="audioRef" :controls="isIntroPlaying"
                    class="w-full max-w-lg scale-in mt-4">
                    <source :src="media + activity.url" type="audio/mpeg" />
                </audio>

                <button @click="stopActivity" class="btn-danger mt-6">❌ Quitter l’activité</button>
            </div>
        </div>
    </AppLayout>
    <ErrorModal v-if="showErrorModal" :visible="showErrorModal" :message="messageModal" @close="redirectToActivities" />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import type { FullActivityResponse } from '../models/Activity'
import activityService from '../services/ActivityService'
import { getMediaType } from '../helper/FunctionUtils'
import ErrorModal from '../components/ErrorModal.vue'

const route = useRoute()
const activity = ref<FullActivityResponse | null>(null)
const isPlaying = ref(false)
const isIntroPlaying = ref(false);
const isFavorite = ref(false)
const isLater = ref(false)
const URL_MEDIA: string = import.meta.env.VITE_URL_MEDIA
const media = `${URL_MEDIA}`
const videoRef = ref<HTMLVideoElement | null>(null)
const audioRef = ref<HTMLAudioElement | null>(null)
const showErrorModal = ref(false);
const id = Number(route.params.id)
let messageModal = "L'activité n'a pas été trouvée"



onMounted(async () => {
    if (!isNaN(id)) {
        try {
            const result = await activityService.getById(id)
            activity.value = result
            isFavorite.value = result.isFavorite || false
            isLater.value = result.isToLater || false
        } catch (error: unknown) {
            const err = error as any;
            if (err?.status === 404) {
                showErrorModal.value = true;
            } else {
                messageModal = "Une erreur est survenue lors de la récupération de l'activité.";
                showErrorModal.value = true;
            }
        }
    }
})


const startActivity = () => {
    isPlaying.value = true;
    const audioIntro = new Audio('/sounds/start-activity.wav');
    audioIntro.volume = 0.8;
    audioIntro.play();

    audioIntro.onended = () => {
        isIntroPlaying.value = true;
        nextTick(() => {
            if (videoRef.value) videoRef.value.play();
            if (audioRef.value) audioRef.value.play();
        });
    };
};

const stopActivity = () => {
    isPlaying.value = false
    isIntroPlaying.value = false;
    if (videoRef.value) videoRef.value.pause()
    if (audioRef.value) audioRef.value.pause()
}

const toggleFavorite = async () => {
    const response = await activityService.toogleFavorite(id)
    if (response.status === 200) {
        isFavorite.value = !isFavorite.value
    }
}
const tooggleLater = async () => {
    const response = await activityService.toogleToLater(id)

    if (response.status === 200) {
        isLater.value = !isLater.value
    }
}

const redirectToActivities = () => {
    nextTick()
    window.location.href = '/activities'
}


</script>

<style scoped>
.bg-custom {
    background-color: #f0f4f8;
}

.btn-primary {
    background-color: #3b82f6;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
}

.btn-danger {
    background-color: #ef4444;
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
}

.btn-secondary {
    background-color: #e0e7ff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
}

.transition-fade {
    transition: opacity 1s ease-in-out;
    opacity: 0;
}

.transition-fade.show {
    opacity: 1;
}

.scale-in {
    animation: scaleIn 0.7s ease-out forwards;
}

@keyframes scaleIn {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
