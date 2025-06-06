<script setup lang="ts">
// imports
import { onMounted, reactive, ref, toRefs } from 'vue';
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

// props
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: '',
  },
});

const { id } = toRefs(props);

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

    appStore.addContact(data);

    followToContacts();
  } catch {
    console.error('Ошибка редактирования контакта');
  }
}

onMounted(() => {
  if (id.value) {
    const currentContact = appStore.contacts.find(
      (contact) => contact.id === id.value,
    );

    if (currentContact) {
      currentContact.tags.forEach((_tag: string, index: number) => {
        addTagField(index + 1);
      });

      formData.name = currentContact.name;
      formData.phone = currentContact.phone;
      formData.email = currentContact.email;
      formData.tags = currentContact.tags;
    }
  }
});
</script>

<template>
  <div class="container edit-contact">
    <a class="edit-contact-link" href="https://vuejs.org/" target="_blank">
      <BaseIcon icon="vue" />
    </a>
    <div class="edit-contact-form-wrap">
      <h2 class="edit-contact-form-title">Редактирование контакта</h2>
      <BaseForm
        class="edit-contact-form"
        submit-text="Сохранить"
        :validation-schema="validationSchema"
        @submit="onSubmit"
      >
        <BaseFormInput v-model="formData.name" :schema="schemaFields.name" />
        <BaseFormInput v-model="formData.phone" :schema="schemaFields.phone" />
        <BaseFormInput v-model="formData.email" :schema="schemaFields.email" />
        <div class="edit-contact-form__tags-wrap">
          <p class="edit-contact-form__tags-label">Теги</p>
          <ul class="edit-contact-form__tags">
            <li
              v-for="(item, index) in schemaTags"
              :key="item.name"
              class="edit-contact-form__tag"
            >
              <BaseFormInput
                v-model="formData.tags[index]"
                :schema="schemaTags[index]"
              />
              <BaseButton
                v-if="isVisibleBtnAddTag(index + 1)"
                class="edit-contact-form__tag-edit"
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
.edit-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  min-height: 100vh;
}

.edit-contact-link {
  .icon {
    @include size(60px);
  }
}

.edit-contact-form-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
}

.edit-contact-form-title {
  text-align: center;

  color: #41b883;
}

.edit-contact-form {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.edit-contact-form__tags-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-contact-form__tags {
  @include list-reset;
}

.edit-contact-form__tag {
  display: flex;
}

.edit-contact-form__tag-edit {
  color: $white;
}

.edit-contact-form__tags-label {
  color: $white;
}
</style>
