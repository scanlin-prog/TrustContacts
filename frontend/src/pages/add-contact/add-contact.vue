<script setup lang="ts">
// imports
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';

import BaseIcon from '@components/base/icon/BaseIcon.vue';
import BaseButton from '@components/base/button/BaseButton.vue';
import BaseForm from '@components/base/form/BaseForm.vue';
import BaseFormInput from '@components/base/form/BaseFormInput.vue';

import { useAppStore } from '@store/app';

import type { IContactFormData } from '@models/contact';

// routes and stores
const router = useRouter();
const appStore = useAppStore();

// vars
const schemaFields = {
  name: {
    name: 'name',
    label: 'Имя',
    placeholder: 'Введите имя',
  },
  phone: {
    name: 'phone',
    label: 'Телефон',
    placeholder: 'Введите телефон',
    type: 'tel',
    mask: '+7 (###) ###-##-##',
  },
  email: {
    name: 'email',
    label: 'Электронная почта',
    placeholder: 'Введите адрес электронной почты',
  },
};

// refs
const schemaTags = ref([
  {
    name: 'tag-1',
    placeholder: 'Введите тег',
  },
]);

const formData: IContactFormData = reactive({
  name: '',
  phone: '',
  email: '',
  tags: [],
});

// watchers

const validationSchema = toTypedSchema(
  yup.object().shape({
    name: yup
      .string()
      .required('Обязательно к заполнению')
      .min(2, ({ min }: { min: number }) => `Не менее ${min} символов`)
      .matches(/^[А-Яа-я]+$/, 'Только кириллица'),
    phone: yup
      .string()
      .required('Обязательно к заполнению')
      .matches(
        /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
        'Введите телефон в формате +7 и 10 цифр номера',
      ),
    email: yup
      .string()
      .required('Обязательно к заполнению')
      .max(255, ({ max }: { max: number }) => `Не более ${max} символов`)
      .matches(
        /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
        'Некорректный email',
      ),
    tags: yup.array().of(yup.string()).default([]),
  }),
);

// functions
function followToContacts() {
  router.push('/');
}

function addTagField(index: number) {
  schemaTags.value.push({
    name: `tag-${index}`,
    placeholder: 'Введите тег',
  });
}

function isVisibleBtnAddTag(index: number) {
  return index === schemaTags.value.length;
}

async function onSubmit() {
  try {
    const data = {
      ...formData,
      phone: formData.phone.replace(/[-()\s]/g, ''),
    };

    await appStore.addContact(data);

    followToContacts();
  } catch {
    console.log('Ошибка создания контакта');
  }
}
</script>

<template>
  <div class="container add-contact">
    <a class="add-contact-link" href="https://vuejs.org/" target="_blank">
      <BaseIcon icon="vue" />
    </a>
    <div class="add-contact-form-wrap">
      <h2 class="add-contact-form-title">Добавление контакта</h2>
      <BaseForm
        class="add-contact-form"
        submit-text="Сохранить"
        :validation-schema="validationSchema"
        @submit="onSubmit"
      >
        <BaseFormInput v-model="formData.name" :schema="schemaFields.name" />
        <BaseFormInput v-model="formData.phone" :schema="schemaFields.phone" />
        <BaseFormInput v-model="formData.email" :schema="schemaFields.email" />
        <div class="add-contact-form__tags-wrap">
          <p class="add-contact-form__tags-label">Теги</p>
          <ul class="add-contact-form__tags">
            <li
              v-for="(item, index) in schemaTags"
              :key="item.name"
              class="add-contact-form__tag"
            >
              <BaseFormInput
                v-model="formData.tags[index]"
                :schema="schemaTags[index]"
              />
              <BaseButton
                v-if="isVisibleBtnAddTag(index + 1)"
                class="add-contact-form__tag-add"
                @click="addTagField(index + 1)"
              >
                <BaseIcon icon="plus" />
              </BaseButton>
            </li>
          </ul>
        </div>

        <template #additional-buttons>
          <BaseButton :secondary="true" :full="true" @follow="followToContacts">
            <span>К списку контактов</span>
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
