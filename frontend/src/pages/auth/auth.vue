<script setup lang="ts">
// imports
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';

import BaseIcon from '@components/base/icon/BaseIcon.vue';
import BaseButton from '@components/base/button/BaseButton.vue';
import BaseForm from '@components/base/form/BaseForm.vue';
import BaseFormInput from '@components/base/form/BaseFormInput.vue';

import { useAuthStore } from '@store/auth';

// routes and stores
const router = useRouter();
const authStore = useAuthStore();

// vars
const schemaFields = {
  lastName: {
    name: 'lastName',
    label: 'Фамилия',
    placeholder: 'Введите фамилию',
  },
  name: {
    name: 'name',
    label: 'Имя',
    placeholder: 'Введите имя',
  },
  email: {
    name: 'email',
    label: 'Электронная почта',
    placeholder: 'Введите адрес электронной почты',
  },
  password: {
    name: 'password',
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',
  },
};

const settingsLogin = {
  pageTitle: 'Авторизация',
  submitBtnText: 'Войти в систему',
  additionalBtnText: 'Зарегистрироваться',
};

const settingsRegister = {
  pageTitle: 'Регистрация',
  submitBtnText: 'Зарегистрироваться',
  additionalBtnText: 'Войти в систему',
};

const validationSchemaLogin = toTypedSchema(
  yup.object().shape({
    email: yup
      .string()
      .required('Обязательно к заполнению')
      .max(255, ({ max }: { max: number }) => `Не более ${max} символов`)
      .matches(
        /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
        'Некорректный email',
      ),
    password: yup
      .string()
      .required('Пароль обязателен для заполнения')
      .min(4, 'Минимальное количество символов: 4'),
  }),
);

const validationSchemaRegister = toTypedSchema(
  yup.object().shape({
    lastName: yup
      .string()
      .required('Обязательно к заполнению')
      .min(2, ({ min }: { min: number }) => `Не менее ${min} символов`)
      .matches(/^[А-Яа-я]+$/, 'Только кириллица'),
    name: yup
      .string()
      .required('Обязательно к заполнению')
      .min(2, ({ min }: { min: number }) => `Не менее ${min} символов`)
      .matches(/^[А-Яа-я]+$/, 'Только кириллица'),
    email: yup
      .string()
      .required('Обязательно к заполнению')
      .max(255, ({ max }: { max: number }) => `Не более ${max} символов`)
      .matches(
        /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
        'Некорректный email',
      ),
    password: yup
      .string()
      .required('Пароль обязателен для заполнения')
      .min(4, 'Минимальное количество символов: 4'),
  }),
);

// refs
const authPage = ref('login');

const formData = reactive({
  lastName: '',
  name: '',
  email: '',
  password: '',
});

const isLoginPage = computed(() => {
  return authPage.value === 'login';
});

const settings = computed(() => {
  return isLoginPage.value ? settingsLogin : settingsRegister;
});

const validationSchema = computed(() => {
  return isLoginPage.value ? validationSchemaLogin : validationSchemaRegister;
});

// watchers

// functions
function changePage() {
  authPage.value = authPage.value === 'login' ? 'register' : 'login';
}

async function onSubmit() {
  try {
    if (isLoginPage.value) {
      const data = {
        email: formData.email,
        password: formData.password,
      };

      await authStore.login(data);
    } else {
      await authStore.register(formData);
    }

    router.push({ path: '/' });
  } catch (error) {
    console.error('Ошибка авторизации/регистрации', error);
  }
}
</script>

<template>
  <div class="container add-contact">
    <a class="add-contact-link" href="https://vuejs.org/" target="_blank">
      <BaseIcon icon="vue" />
    </a>
    <div class="add-contact-form-wrap">
      <h2 class="add-contact-form-title">{{ settings.pageTitle }}</h2>
      <BaseForm
        class="add-contact-form"
        :submit-text="settings.submitBtnText"
        :validation-schema="validationSchema"
        @submit="onSubmit"
      >
        <template v-if="isLoginPage">
          <BaseFormInput
            v-model="formData.email"
            :schema="schemaFields.email"
          />
          <BaseFormInput
            v-model="formData.password"
            :schema="schemaFields.password"
          />
        </template>
        <template v-else>
          <BaseFormInput
            v-model="formData.lastName"
            :schema="schemaFields.lastName"
          />
          <BaseFormInput v-model="formData.name" :schema="schemaFields.name" />
          <BaseFormInput
            v-model="formData.email"
            :schema="schemaFields.email"
          />
          <BaseFormInput
            v-model="formData.password"
            :schema="schemaFields.password"
          />
        </template>

        <template #additional-buttons>
          <BaseButton :secondary="true" :full="true" @follow="changePage">
            <span>{{ settings.additionalBtnText }}</span>
          </BaseButton>
        </template>
      </BaseForm>
    </div>
  </div>
</template>

<style lang="scss">
.add-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  min-height: 100vh;
}

.add-contact-link {
  .icon {
    @include size(60px);
  }
}

.add-contact-form-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
}

.add-contact-form-title {
  text-align: center;

  color: #41b883;
}

.add-contact-form {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.add-contact-form__tags-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.add-contact-form__tags {
  @include list-reset;
}

.add-contact-form__tag {
  display: flex;
}

.add-contact-form__tag-add {
  color: $white;
}

.add-contact-form__tags-label {
  color: $white;
}
</style>
