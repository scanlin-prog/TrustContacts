<script setup lang="ts">
// imports
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';

import BaseIcon from '@components/base/icon/BaseIcon.vue';
import BaseButton from '@components/base/button/BaseButton.vue';
import BaseFormInput from '@components/base/form/BaseFormInput.vue';
import BlockContact from '@components/block/cell/BlockContact.vue';

import { useAuthStore } from '@store/auth';
import { useAppStore } from '@store/app';

// routes and stores
const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

// vars
const schemaFields = {
  search: {
    name: 'search',
    placeholder: 'Поиск по имени',
  },
};

const validationSchema = toTypedSchema(
  yup.object().shape({
    search: yup
      .string()
      .min(2, ({ min }: { min: number }) => `Не менее ${min} символов`)
      .matches(/^[А-Яа-я]+$/, 'Только кириллица'),
  }),
);

// refs
const query = ref('');

const contactList = computed(() => {
  return appStore.contacts;
});

// functions
function followToPage() {
  router.push('/add-contact');
}

async function handleLogout() {
  try {
    await authStore.logout();

    router.push('/auth');
  } catch (error) {
    console.error('Ошибка при выходе с приложения', error);
  }
}

async function handleSearch() {
  try {
    await appStore.searchContacts(query.value);
  } catch (error) {
    console.error('Ошибка при поиске контактов', error);
  }
}

function resetSearch() {
  query.value = '';
}

onMounted(async () => {
  await appStore.getContacts();
});
</script>

<template>
  <div class="container contacts">
    <a class="contacts-link" href="https://vite.dev" target="_blank">
      <BaseIcon icon="vite" />
    </a>
    <div class="contacts-table">
      <h2 class="contacts-table__title">Список контактов</h2>
      <Form
        v-slot="{ handleSubmit, isSubmitting }"
        class="contacts__form"
        novalidate
        :validation-schema="validationSchema"
      >
        <form
          class="contacts__form-inner"
          @submit.prevent="handleSubmit(handleSearch)"
        >
          <BaseFormInput v-model="query" :schema="schemaFields.search" />
          <div class="contacts__form-btns">
            <BaseButton
              class="contacts__form-submit"
              button-type="submit"
              :disabled="isSubmitting"
              :primary="true"
            >
              <span>Найти</span>
            </BaseButton>
            <BaseButton
              class="contacts__form-btn"
              :secondary="true"
              @click="resetSearch"
            >
              <span>Очистить</span>
            </BaseButton>
          </div>
        </form>
      </Form>
      <div class="contacts-table__content-wrap">
        <div class="contacts-table__content">
          <div class="contacts-table__header">
            <p class="contacts-table__header-title">Имя</p>
            <p class="contacts-table__header-value">Телефон</p>
            <p class="contacts-table__header-value">Почта</p>
            <p class="contacts-table__header-value">Теги</p>
            <p class="contacts-table__header-value">Дата изменений</p>
            <p class="contacts-table__header-title">Действия</p>
          </div>
          <ul v-if="contactList.length" class="contacts-table__list">
            <li
              v-for="item in contactList"
              :key="item.id"
              class="contacts-table__item"
            >
              <BlockContact :data="item" />
            </li>
          </ul>
          <div v-else class="empty">
            <p class="empty__title">Контактов нет</p>
            <p class="empty__text">
              Добавьте свой первый контакт, кликнув по кнопке ниже
            </p>
          </div>
        </div>
      </div>
      <div class="contacts__btns">
        <BaseButton
          class="contacts__btn-back"
          :secondary="true"
          :full="true"
          @follow="followToPage"
        >
          <span>Добавить контакт</span>
          <BaseIcon icon="plus" />
        </BaseButton>
        <BaseButton
          class="contacts__btn-back"
          :primary="true"
          :full="true"
          @click="handleLogout"
        >
          <span>Выйти</span>
        </BaseButton>
      </div>
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.contacts-table__content-wrap {
  overflow: scroll;
}

.contacts-table__content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 1024px;
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

.contacts__form {
  form {
    display: flex;
    gap: 20px;

    @include phone {
      flex-direction: column;
      gap: 12px;
    }
  }
}

.contacts__form-btns {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  @include phone {
    flex-direction: column;
    gap: 8px;

    .btn {
      width: 100%;
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  margin-top: 20px;
}

.empty__title,
.empty__text {
  font-size: 20px;
  color: #ffc81f;
}

.empty__text {
  font-size: 14px;
}
</style>
