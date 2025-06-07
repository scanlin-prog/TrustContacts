import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@app/router/routes';

import { useAuthStore } from '@store/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Защищаем маршруты
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Получаем доступ к authStore
  const isAuthenticated = authStore.authorized; // Проверяем, авторизован ли пользователь

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth'); // Если не авторизован, перенаправляем на /auth
  } else {
    next(); // Если авторизован, продолжаем
  }
});

// Перенаправление на /auth при первом заходе
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Если пользователь еще не авторизован и пытается зайти на главную страницу,
  // перенаправляем его на страницу авторизации
  if (!authStore.authorized && to.path === '/') {
    next('/auth'); // Если не авторизован, перенаправляем на /auth
  } else {
    next(); // Если авторизован, продолжаем
  }
});

export default router;
