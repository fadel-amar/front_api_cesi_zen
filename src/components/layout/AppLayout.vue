<template>
    <component :is="headerComponent" />
    <slot />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import HeaderMobile from './HeaderMobile.vue'
import HeaderDesktop from './HeaderDesktop.vue'

const isMobile = ref(false);

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768;
};

const headerComponent = computed(() => (isMobile.value ? HeaderMobile : HeaderDesktop));

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
});
</script>
