<script setup lang="ts">
// imports
import '@assets/styles/main.scss';

import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import Cookies from 'js-cookie';

import { useAuthStore } from '@store/auth';

import MainLayout from '@layouts/default.vue';

// routes and stores
const router = useRouter();
const authStore = useAuthStore();

async function initializeApp() {
  try {
    const token = Cookies.get('token');

    if (token) {
      authStore.token = token;

      await authStore.getSession();

      if (!authStore.authorized) {
        router.push('/auth');
      } else {
        router.push('/');
      }
    }
  } catch (error) {
    console.error('Ошибка получения сессии:', error);
  }
}

onMounted(async () => {
  await initializeApp();
});
</script>

<template>
  <MainLayout> </MainLayout>
</template>

<style lang="scss"></style>
