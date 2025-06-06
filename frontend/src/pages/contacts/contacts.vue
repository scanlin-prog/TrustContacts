<script setup lang="ts">
// imports
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import BaseIcon from '@components/base/icon/BaseIcon.vue';
import BaseButton from '@components/base/button/BaseButton.vue';
import BlockContact from '@components/block/cell/BlockContact.vue';

import { useAppStore } from '@store/app';

// types

// vars

// routes and stores
const router = useRouter();
const appStore = useAppStore();

// refs
const contactList = computed(() => {
  return appStore.contacts;
});

// functions
function followToPage() {
  router.push('/add-contact');
}
</script>

<template>
  <div class="container contacts">
    <a class="contacts-link" href="https://vite.dev" target="_blank">
      <BaseIcon icon="vite" />
    </a>
    <div class="contacts-table">
      <h2 class="contacts-table__title">Список контактов</h2>
      <div class="contacts-table__content">
        <div class="contacts-table__header">
          <p class="contacts-table__header-title">Имя</p>
          <p class="contacts-table__header-value">Телефон</p>
          <p class="contacts-table__header-value">Почта</p>
          <p class="contacts-table__header-value">Теги</p>
          <p class="contacts-table__header-value">Дата изменений</p>
          <p class="contacts-table__header-title">Действия</p>
        </div>
        <ul class="contacts-table__list">
          <li
            v-for="item in contactList"
            :key="item.id"
            class="contacts-table__item"
          >
            <BlockContact :data="item" />
          </li>
        </ul>
      </div>
      <BaseButton
        class="contacts__btn-back"
        :secondary="true"
        :full="true"
        @follow="followToPage"
      >
        <span>Добавить контакт</span>
        <BaseIcon icon="plus" />
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss">
.contacts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  min-height: 100vh;
}

.contacts-link {
  .icon {
    @include size(60px);
  }
}

.contacts-table {
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.contacts-table__header {
  display: grid;
  grid-template-columns: repeat(5, 1fr) 100px;
}

.contacts-table__header-title,
.contacts-table__header-value {
  padding: 10px 12px;

  color: $white;
  border: 1px solid $grey;
}

.contacts-table__header-value {
  color: $secondary;
}

.contacts-table__title {
  text-align: center;

  color: #ffc81f;
}

.contacts-table__list {
  @include list-reset;
  display: flex;
  flex-direction: column;
}

.contacts__btn-back {
  margin-top: 10px;
}
</style>
