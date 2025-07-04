<template>
  <AppLayout>
    <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-24 bg-custom text-gray-900">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-semibold text-center w-full">🏃‍♀️ Gestion des activités</h1>
        <div class="flex justify-end mt-2">
          <router-link to="/admin/dashboard" class="text-blue-600 hover:underline text-sm sm:text-base">
            ← Retour au tableau de bord
          </router-link>
        </div>
      </div>
      <div class="mb-4 flex justify-end">
        <button @click="showAddModal = true" class="btn-primary text-white shadow">
          + Nouvelle activité
        </button>
      </div>
      <div class="rounded-lg shadow">
        <table class="min-w-full bg-white border border-gray-200 hidden sm:table">
          <thead class="bg-gray-100">
            <tr>
              <th class="text-left px-4 py-2">Titre</th>
              <th class="text-left px-4 py-2">Image</th>
              <th class="text-left px-4 py-2">Type</th>
              <th class="text-left px-4 py-2">Catégorie</th>
              <th class="text-left px-4 py-2">Statut</th>
              <th class="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="act in activities" :key="act.id" class="border-t border-gray-100 hover:bg-blue-50">
              <td class="px-4 py-3">{{ act.title }}</td>
              <td class="px-4 py-3">
                <img :src="media + act.imagePresentation" alt="Image" class="w-10 h-10 object-cover rounded" />
              </td>
              <td class="px-4 py-3">{{ act.type }}</td>
              <td class="px-4 py-3">{{ act.category }}</td>
              <td class="px-4 py-3">{{ act.status ? 'Active' : 'Désactivée' }}</td>
              <td class="px-4 py-3 text-right">
                <div class="inline-block relative">
                  <button @click.stop="openActionMenu(act.id, $event)"
                    class="text-gray-600 hover:text-gray-900 text-lg cursor-pointer">
                    ⋮
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex flex-col gap-4 sm:hidden">
          <div v-for="act in activities" :key="act.id" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-semibold text-gray-800">{{ act.title }}</p>
                <p class="text-sm text-gray-600">
                  Image: <img :src="media + act.imagePresentation" alt="Image"
                    class="inline w-8 h-8 object-cover rounded" />
                </p>
                <p class="text-sm text-gray-600">Type: {{ act.type }}</p>
                <p class="text-sm text-gray-600">Catégorie: {{ act.category }}</p>
                <p class="text-sm text-gray-600">Statut: {{ act.status ? 'Active' : 'Désactivée' }}</p>
              </div>
              <button @click.stop="openActionMenu(act.id, $event)"
                class="text-gray-600 hover:text-gray-900 text-lg cursor-pointer">
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
          <router-link :to="`activities/edit/${actionMenuId}`"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Modifier
          </router-link>
          <button @click="confirmDeleteActivity(actionMenuId!)"
            class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
            Supprimer
          </button>
        </div>
      </Teleport>
      <ConfirmModal :visible="showConfirmModal" message="Voulez-vous vraiment supprimer cette activité ?"
        @confirm="deleteActivity" />
      <CreateActivityModal v-if="showAddModal" :visible="showAddModal" :global-error="globalError"
        @confirm="createActivity" @cancel="() => {
          showAddModal = false
          globalError = ''
        }" />
      <ErrorModal :visible="showErrorModal" @close="showErrorModal = false" />
      <SuccessModal :visible="showSuccessModal" :message="successMessage" @close="showSuccessModal = false" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ConfirmModal from '@/components/ConfirmDeleteModal.vue'
import CreateActivityModal from '@/components/Management/CreateActivityModal.vue'
import ErrorModal from '@/components/ErrorModal.vue'
import SuccessModal from '@/components/SuccessModal.vue'
import type { ActivityResponse, CreateActivity } from '../models/Activity'
import activityService from '../services/ActivityService'
import { useContextMenu } from '../components/UseContextMenu'


const URL_MEDIA: string = import.meta.env.VITE_URL_MEDIA;

const media = ref(URL_MEDIA)
const activities = ref<ActivityResponse[]>([])
const showConfirmModal = ref(false)
const activityIdToDelete = ref<number | null>(null)
const showEditModal = ref(false)
const showAddModal = ref(false)
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const successMessage = ref('')
const globalError = ref('')
const { actionMenuId, menuRefs, menuPosition, openActionMenu, closeMenu } = useContextMenu()


const fetchActivities = async () => {
  try {
    activities.value = (await activityService.getAll()).activities
  } catch {
    showErrorModal.value = true
  }
}

const confirmDeleteActivity = (id: number) => {
  activityIdToDelete.value = id
  showConfirmModal.value = true
  closeMenu()
}

const deleteActivity = async () => {
  if (activityIdToDelete.value !== null) {
    try {
      const response = await activityService.delete(activityIdToDelete.value)
      if (response.status === 200 || response.status === 204) {
        await fetchActivities()
        showSuccessModal.value = true
        successMessage.value = 'Activité supprimée avec succès'
      } else {
        showErrorModal.value = true
      }
    } catch {
      showErrorModal.value = true
    }
  }
  showConfirmModal.value = false
  activityIdToDelete.value = null
}


const createActivity = async (activity: CreateActivity) => {
  try {
    const response = await activityService.create(activity)
    if (response.status === 201) {
      await fetchActivities()
      showSuccessModal.value = true
      successMessage.value = 'Activité créée avec succès'
      showAddModal.value = false
      globalError.value = ''
    }
  } catch (error: any) {
    if (error.response.status === 400) {
    } else {
      globalError.value = 'Erreur lors de la création de l\'activité.'
    }
    showErrorModal.value = true
  }
}

onMounted(() => {
  showEditModal.value = false
  showAddModal.value = false
  fetchActivities()
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

table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

th,
td {
  padding: 10px 12px;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  font-weight: 600;
  background-color: #f8fafc;
}

tr:hover {
  background-color: #eef2ff;
}

.fixed {
  z-index: 100;
}
</style>