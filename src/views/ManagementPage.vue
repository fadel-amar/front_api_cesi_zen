<template>
    <AppLayout>
        <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-24 bg-custom text-gray-900">
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl font-semibold text-center w-full">📄 Gestion des pages</h1>
                <div class="flex justify-end mt-2">
                    <router-link to="/admin/dashboard" class="text-blue-600 hover:underline text-sm sm:text-base">
                        ← Retour au tableau de bord
                    </router-link>
                </div>
            </div>
            <div class="mb-4 flex justify-end">
                <router-link to="/admin/pages/create" class="btn-primary text-white shadow">
                    + Nouvelle page
                </router-link>
            </div>
            <div class="rounded-lg shadow">
                <table class="min-w-full bg-white border border-gray-200 hidden sm:table">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="text-left px-4 py-2">Titre</th>
                            <th class="text-left px-4 py-2">Visibilité</th>
                            <th class="text-right px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="page in pages" :key="page.id" class="border-t border-gray-100 hover:bg-blue-50">
                            <td class="px-4 py-3">{{ page.title }}</td>
                            <td class="px-4 py-3">{{ page.visibility ? 'Visible' : 'Masquée' }}</td>
                            <td class="px-4 py-3 text-right">
                                <div class="inline-block relative">
                                    <button @click.stop="openActionMenu(page.id, $event)"
                                        class="text-gray-600 hover:text-gray-900 text-lg cursor-pointer">
                                        ⋮
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="sm:hidden space-y-4 mt-4">
                    <div v-for="page in pages" :key="page.id" class="bg-white shadow rounded-lg p-4 relative">
                        <div class="text-lg font-semibold text-gray-800 mb-1">{{ page.title }}</div>
                        <div class="text-sm text-gray-600 mb-2">
                            Visibilité : <span class="font-medium">{{ page.visibility ? 'Visible' : 'Masquée' }}</span>
                        </div>
                        <div class="flex justify-end">
                            <button @click.stop="openActionMenu(page.id, $event)"
                                class="text-gray-600 hover:text-gray-900 text-xl cursor-pointer">
                                ⋮
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Teleport to="body">
                <div v-if="actionMenuId !== null" :ref="el => menuRefs[actionMenuId!] = el as HTMLElement | null"
                    class="fixed bg-white border border-gray-200 rounded shadow-md z-100 w-32 sm:w-36"
                    :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }">
                    <router-link :to="`/admin/pages/edit/${actionMenuId}`"
                        class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Modifier
                    </router-link>
                    <button @click="confirmDeletePage(actionMenuId!)"
                        class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                        Supprimer
                    </button>
                </div>
            </Teleport>
            <ConfirmModal :visible="showConfirmModal" message="Voulez-vous vraiment supprimer cette page ?"
                @confirm="deletePage" />
            <SuccessModal :visible="showSuccessModal" :message="successMessage" @close="showSuccessModal = false" />
            <ErrorModal :visible="showErrorModal" @close="showErrorModal = false" />
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ConfirmModal from '@/components/ConfirmDeleteModal.vue'
import SuccessModal from '@/components/SuccessModal.vue'
import ErrorModal from '@/components/ErrorModal.vue'
import pageService from '../services/pageService'
import type { PageResponse } from '../models/Page'
import { useContextMenu } from '../components/UseContextMenu'

const pages = ref<PageResponse[]>([])
const showConfirmModal = ref(false)
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const successMessage = ref('')
const pageIdToDelete = ref<number | null>(null)
const { actionMenuId, menuRefs, menuPosition, openActionMenu, closeMenu } = useContextMenu()


const fetchPages = async () => {
    try {
        const response = await pageService.getAll()
        pages.value = response
    } catch {
        showErrorModal.value = true
    }
}


const confirmDeletePage = (id: number) => {
    pageIdToDelete.value = id
    showConfirmModal.value = true
    closeMenu()
}

const deletePage = async () => {
    if (pageIdToDelete.value !== null) {
        try {
            const response = await pageService.delete(pageIdToDelete.value)
            if (response.status === 204) {
                await fetchPages()
                showSuccessModal.value = true
                successMessage.value = 'Page supprimée avec succès'
            } else {
                showErrorModal.value = true
            }
        } catch (err) {
            console.log(err)
            showErrorModal.value = true
        }
    }
    showConfirmModal.value = false
    pageIdToDelete.value = null
}

onMounted(() => {
    fetchPages()
})
</script>

<style scoped>
.bg-custom {
    background-color: #f0f4f8;
}

.btn-primary {
    background: linear-gradient(90deg, #4f83e8, #5babf5);
    border-radius: 8px;
    padding: 8px 16px;
    transition: background 0.3s;
    font-weight: 500;
}

.btn-primary:hover {
    background: linear-gradient(90deg, #5babf5, #4f83e8);
}
</style>
