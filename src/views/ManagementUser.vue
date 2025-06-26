<template>
  <AppLayout>
    <div class="min-h-screen px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 pb-10 bg-custom text-gray-900">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-semibold text-center w-full">👥 Gestion des utilisateurs</h1>
        <div class="flex justify-end mt-2">
          <router-link to="/admin/dashboard" class="text-blue-600 hover:underline text-sm sm:text-base">
            ← Retour au tableau de bord
          </router-link>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        <input v-model="filters.login" type="text" placeholder="Filtrer par identifiant (login ou email)"
          class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-48 shadow-sm focus:ring-2 focus:ring-blue-500" />
        <button @click="fetchUsers" class="btn-primary text-white shadow w-full sm:w-auto">
          Rechercher
        </button>
      </div>
      <div class="rounded-lg shadow">
        <table class="min-w-full bg-white border border-gray-200 hidden sm:table">
          <thead class="bg-gray-100">
            <tr>
              <th class="text-left px-4 py-2 hidden md:table-cell">ID</th>
              <th class="text-left px-4 py-2">Email</th>
              <th class="text-left px-4 py-2">Login</th>
              <th class="text-left px-4 py-2 hidden md:table-cell">Banni</th>
              <th class="text-left px-4 py-2 hidden md:table-cell">Désactivé</th>
              <th class="text-left px-4 py-2">Rôle</th>
              <th class="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-t border-gray-100 hover:bg-blue-50">
              <td class="px-4 py-3 hidden md:table-cell">{{ user.id }}</td>
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">{{ user.login }}</td>
              <td class="px-4 py-3 hidden md:table-cell">{{ user.banned ? 'Oui' : 'Non' }}</td>
              <td class="px-4 py-3 hidden md:table-cell">{{ user.disabled ? 'Oui' : 'Non' }}</td>
              <td class="px-4 py-3">{{ user.role }}</td>
              <td class="px-4 py-3 text-right">
                <div class="inline-block relative">
                  <button @click.stop="openActionMenu(user.id, $event)"
                    class="text-gray-600 hover:text-gray-900 text-lg">
                    ⋮
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex flex-col gap-4 sm:hidden">
          <div v-for="user in users" :key="user.id" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-semibold text-gray-800">{{ user.email }}</p>
                <p class="text-sm text-gray-600">Login: {{ user.login }}</p>
                <p class="text-sm text-gray-600">Rôle: {{ user.role }}</p>
              </div>
              <button @click.stop="openActionMenu(user.id, $event)" class="text-gray-600 hover:text-gray-900 text-lg">
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
          <button @click="showEditModal(users.find(u => u.id === actionMenuId)!)"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Modifier
          </button>
          <button @click="showDeleteConfirmModal(actionMenuId!)"
            class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
            Supprimer
          </button>
        </div>
      </Teleport>
      <ConfirmModal :visible="showConfirmModal" message="Voulez-vous vraiment supprimer cet utilisateur ?"
        @confirm="confirmDelete" @cancel="cancelDelete" />
      <EditUserModal v-if="shouldShowEditModal" :visible="shouldShowEditModal" :user="selectedUser"
        @confirm="confirmEdit" @cancel="cancelEdit" />
      <ErrorModal :visible="showErrorModal" @close="showErrorModal = false" />
      <div class="flex flex-col sm:flex-row justify-center mt-6 gap-2 items-center">
        <button :disabled="pagination.pageNumber <= 1" @click="changePage(pagination.pageNumber - 1)"
          class="btn-primary text-white disabled:opacity-50 w-full sm:w-auto">
          Préc.
        </button>
        <span class="px-4 py-2 border-t border-b text-sm sm:text-base">
          Page {{ pagination.pageNumber }} / {{ pagination.totalPages }}
        </span>
        <button :disabled="pagination.pageNumber >= pagination.totalPages"
          @click="changePage(pagination.pageNumber + 1)"
          class="btn-primary text-white disabled:opacity-50 w-full sm:w-auto">
          Suiv.
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ConfirmModal from '@/components/ConfirmDeleteModal.vue'
import EditUserModal from '@/components/Management/EditUserModal.vue'
import ErrorModal from '@/components/ErrorModal.vue'
import * as userService from '../services/userService.ts'
import type { UserResponse, ListUserResponse } from '../models/UserResponse.ts'

const users = ref<UserResponse[]>([])
const filters = ref({ login: '' })
const pagination = ref({ pageNumber: 1, pageSize: 10, totalPages: 1 })
const actionMenuId = ref<number | null>(null)
const menuRefs = ref<{ [key: number]: HTMLElement | null }>({})
const menuPosition = ref({ top: 0, left: 0 })
const showConfirmModal = ref(false)
const userIdToDelete = ref<number | null>(null)
const shouldShowEditModal = ref(false)
const selectedUser = ref<UserResponse | null>(null)
const showErrorModal = ref(false)

const fetchUsers = async () => {
  try {
    const response: ListUserResponse = await userService.getAllUsers(
      pagination.value.pageNumber,
      pagination.value.pageSize,
      filters.value.login
    )
    users.value = response.users
    pagination.value.totalPages = response.totalPages
    if (shouldShowEditModal.value) {
      shouldShowEditModal.value = false
      selectedUser.value = null
    }
  } catch {
    showErrorModal.value = true
  }
}

const changePage = (page: number) => {
  pagination.value.pageNumber = page
  fetchUsers()
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

const showDeleteConfirmModal = (id: number) => {
  userIdToDelete.value = id
  showConfirmModal.value = true
  actionMenuId.value = null
}

const confirmDelete = async () => {
  if (userIdToDelete.value !== null) {
    try {
      await userService.deleteUser(userIdToDelete.value)
      fetchUsers()
    } catch {
      showErrorModal.value = true
    }
  }
  showConfirmModal.value = false
  userIdToDelete.value = null
}

const cancelDelete = () => {
  showConfirmModal.value = false
  userIdToDelete.value = null
}

const showEditModal = (user: UserResponse) => {
  selectedUser.value = user
  shouldShowEditModal.value = true
  actionMenuId.value = null
}

const confirmEdit = async (userData: Partial<UserResponse>) => {
  if (selectedUser.value) {
    try {
      await userService.updateUser(selectedUser.value.id, userData)
      fetchUsers()
    } catch {
      showErrorModal.value = true
    }
  }
  shouldShowEditModal.value = false
  selectedUser.value = null
}

const cancelEdit = () => {
  shouldShowEditModal.value = false
  selectedUser.value = null
}

const handleClickOutside = (event: MouseEvent) => {
  if (actionMenuId.value === null) return
  const menu = menuRefs.value[actionMenuId.value]
  if (menu && !menu.contains(event.target as Node)) {
    actionMenuId.value = null
  }
}

watch(shouldShowEditModal, (newVal) => {
  if (newVal && !selectedUser.value) {
    shouldShowEditModal.value = false
  }
})

onMounted(() => {
  shouldShowEditModal.value = false
  selectedUser.value = null
  fetchUsers()
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