<template>
  <AppLayout>
    <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-10 bg-custom text-gray-900">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-semibold text-center w-full">📂 Gestion des catégories</h1>
        <div class="flex justify-end mt-2">
          <router-link to="/admin/dashboard" class="text-blue-600 hover:underline text-sm sm:text-base">
            ← Retour au tableau de bord
          </router-link>
        </div>
      </div>
      <div class="mb-4 flex justify-end">
        <button @click="showAddModal = true" class="btn-primary text-white shadow">
          + Nouvelle catégorie
        </button>
      </div>
      <div class="rounded-lg shadow">
        <table class="min-w-full bg-white border border-gray-200 hidden sm:table">
          <thead class="bg-gray-100">
            <tr>
              <th class="text-left px-4 py-2">Nom</th>
              <th class="text-left px-4 py-2">Emoji</th>
              <th class="text-left px-4 py-2">Durée</th>
              <th class="text-left px-4 py-2">Statut</th>
              <th class="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id" class="border-t border-gray-100 hover:bg-blue-50">
              <td class="px-4 py-3">{{ cat.name }}</td>
              <td class="px-4 py-3">{{ cat.emoji }}</td>
              <td class="px-4 py-3">{{ cat.duration }}</td>
              <td class="px-4 py-3">{{ cat.status ? 'Active' : 'Désactivée' }}</td>
              <td class="px-4 py-3 text-right">
                <div class="inline-block relative">
                  <button @click.stop="openActionMenu(cat.id, $event)"
                    class="text-gray-600 hover:text-gray-900 text-lg">
                    ⋮
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex flex-col gap-4 sm:hidden">
          <div v-for="cat in categories" :key="cat.id" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-semibold text-gray-800">{{ cat.name }}</p>
                <p class="text-sm text-gray-600">Emoji: {{ cat.emoji }}</p>
                <p class="text-sm text-gray-600">Durée: {{ cat.duration }}</p>
                <p class="text-sm text-gray-600">Statut: {{ cat.status ? 'Active' : 'Désactivée' }}</p>
              </div>
              <button @click.stop="openActionMenu(cat.id, $event)" class="text-gray-600 hover:text-gray-900 text-lg">
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
          <button @click="editCategory(categories.find(c => c.id === actionMenuId)!)"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Modifier
          </button>
          <button @click="confirmDeleteCategory(actionMenuId!)"
            class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
            Supprimer
          </button>
        </div>
      </Teleport>
      <ConfirmModal :visible="showConfirmModal" message="Voulez-vous vraiment supprimer cette catégorie ?"
        @confirm="deleteCategory" @cancel="cancelDelete" />
      <EditCategoryModal v-if="showEditModal" :visible="showEditModal" :category="selectedCategory"
        :api-errors="apiErrors" @confirm="confirmEditCategory"
        @cancel="() => { showEditModal = false; apiErrors = {} }" />
      <CreateCategoryModal v-if="showAddModal" :visible="showAddModal" :api-errors="apiErrors" @confirm="createCategory"
        @cancel="() => { showAddModal = false; apiErrors = {} }" />
      <ErrorModal :visible="showErrorModal" @close="showErrorModal = false" />
      <SuccessModal :visible="showSuccessModal" :message="successMessage" @close="showSuccessModal = false" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ConfirmModal from '@/components/ConfirmDeleteModal.vue'
import EditCategoryModal from '@/components/Management/EditCategoryModal.vue'
import CreateCategoryModal from '@/components/Management/CreateCategoryModal.vue'
import ErrorModal from '@/components/ErrorModal.vue'
import SuccessModal from '@/components/SuccessModal.vue'
import type { CategoryResponse, CreateCategory, UpdateCategory } from '../models/Category.ts'
import categoryService from '../services/CategoryService.ts'

const categories = ref<CategoryResponse[]>([])
const actionMenuId = ref<number | null>(null)
const menuRefs = ref<{ [key: number]: HTMLElement | null }>({})
const menuPosition = ref({ top: 0, left: 0 })
const showConfirmModal = ref(false)
const categoryIdToDelete = ref<number | null>(null)
const showEditModal = ref(false)
const selectedCategory = ref<CategoryResponse | null>(null)
const showAddModal = ref(false)
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const successMessage = ref('')
const apiErrors = ref<{ [key: string]: string[] }>({})

const fetchCategories = async () => {
  try {
    categories.value = (await categoryService.getAll()).categories;
  } catch {
    showErrorModal.value = true
  }
}

const openActionMenu = (id: number, event: MouseEvent) => {
  actionMenuId.value = actionMenuId.value === id ? null : id
  if (actionMenuId.value !== null) {
    const button = event.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()
    const menuWidth = window.innerWidth < 640 ? 128 : 144
    let left = rect.right + window.scrollX - menuWidth
    if (left < 0) left = 8
    if (left + menuWidth > window.innerWidth) left = window.innerWidth - menuWidth - 8
    menuPosition.value = {
      top: rect.bottom + window.scrollY + 4,
      left
    }
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (actionMenuId.value === null) return
  const menu = menuRefs.value[actionMenuId.value]
  if (menu && !menu.contains(event.target as Node)) {
    actionMenuId.value = null
  }
}

const confirmDeleteCategory = (id: number) => {
  categoryIdToDelete.value = id
  showConfirmModal.value = true
  actionMenuId.value = null
}

const deleteCategory = async () => {
  if (categoryIdToDelete.value !== null) {
    try {
      const response = await categoryService.delete(categoryIdToDelete.value)
      if (response.status === 200 || response.status === 204) {
        fetchCategories()
        showSuccessModal.value = true
        successMessage.value = 'Catégorie supprimée avec succès'
      } else {
        showErrorModal.value = true
      }
    } catch {
      showErrorModal.value = true
    }
  }
  showConfirmModal.value = false
  categoryIdToDelete.value = null
}

const cancelDelete = () => {
  showConfirmModal.value = false
  categoryIdToDelete.value = null
}

const editCategory = (cat: CategoryResponse) => {
  selectedCategory.value = cat
  showEditModal.value = true
  actionMenuId.value = null
  apiErrors.value = {}
}

const confirmEditCategory = async (category: UpdateCategory) => {
  if (selectedCategory.value) {
    try {
      const response = await categoryService.update(selectedCategory.value.id, category)
      if (response.status === 201 || response.status === 204) {
        fetchCategories()
        showSuccessModal.value = true
        successMessage.value = 'Catégorie mise à jour avec succès'
        showEditModal.value = false
        selectedCategory.value = null
        apiErrors.value = {}
      } else if (response.status === 400 && response.errors) {
        apiErrors.value = response.errors
      } else {
        showErrorModal.value = true
      }
    } catch {
      showErrorModal.value = true
    }
  }
}

const createCategory = async (category: CreateCategory) => {
  try {
    const response = await categoryService.create(category)
    if (response.status === 201 || response.status === 204) {
      fetchCategories()
      showSuccessModal.value = true
      successMessage.value = 'Catégorie créée avec succès'
      showAddModal.value = false
      apiErrors.value = {}
    }
    else {
      showErrorModal.value = true
    }
  } catch {
    showErrorModal.value = true
  }
}

onMounted(() => {
  showEditModal.value = false
  showAddModal.value = false
  fetchCategories()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
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