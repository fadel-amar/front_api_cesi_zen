<template>
    <AppLayout>
        <div class="min-h-screen bg-gray-50 text-gray-900 px-4 md:px-16 pb-32 pt-24">
            <!-- Titre -->
            <h1 class="text-4xl md:text-5xl font-semibold text-center mb-12">
                Tableau de bord <span class="text-blue-600">Admin</span>
            </h1>

            <!-- Cartes de navigation -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <router-link to="/admin/users"
                    class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200 text-center hover:text-blue-600">
                    <h3 class="text-xl font-semibold mb-2">👤 Gestion des utilisateurs</h3>
                    <p class="text-sm text-gray-500">Créer, modifier, supprimer des comptes.</p>
                </router-link>

                <router-link to="/admin/categories"
                    class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200 text-center hover:text-blue-600">
                    <h3 class="text-xl font-semibold mb-2">📂 Gestion des catégories</h3>
                    <p class="text-sm text-gray-500">Organiser les types d’activités bien-être.</p>
                </router-link>

                <router-link to="/admin/activities"
                    class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200 text-center hover:text-blue-600">
                    <h3 class="text-xl font-semibold mb-2">🏃‍♀️ Gestion des activités</h3>
                    <p class="text-sm text-gray-500">Ajouter ou modifier des séances bien-être.</p>
                </router-link>

                <router-link to="/admin/pages"
                    class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200 text-center hover:text-blue-600">
                    <h3 class="text-xl font-semibold mb-2">📄 Pages d’information</h3>
                    <p class="text-sm text-gray-500">Gérer les contenus informatifs disponibles.</p>
                </router-link>

                <router-link to="/admin/menus"
                    class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-200 text-center hover:text-blue-600">
                    <h3 class="text-xl font-semibold mb-2">📋 Gestion des menus</h3>
                    <p class="text-sm text-gray-500">Contrôler la navigation de l’application.</p>
                </router-link>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/layout/AppLayout.vue'
</script>

<style scoped></style>
