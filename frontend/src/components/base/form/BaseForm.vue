<script setup lang="ts">
// imports
import BaseButton from '@components/base/button/BaseButton.vue';

import { toRefs } from 'vue';
import { Form } from 'vee-validate';

import type { PropType } from 'vue';
import type { TypedSchema } from 'vee-validate';

// props
const props = defineProps({
  validationSchema: {
    type: Object as PropType<TypedSchema>,
    required: true,
  },
  submitText: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['submit']);

// refs
const { validationSchema, submitText } = toRefs(props);

// functions
function onSubmit() {
  emit('submit');
}
</script>

<template>
  <Form
    v-slot="{ handleSubmit, isSubmitting }"
    class="base-form"
    novalidate
    :validation-schema="validationSchema"
  >
    <form @submit.prevent="handleSubmit(onSubmit)">
      <slot />
      <div class="base-form__buttons">
        <BaseButton
          class="base-form__submit"
          button-type="submit"
          :disabled="isSubmitting"
          :primary="true"
          :full="true"
        >
          <span>{{ submitText }}</span>
        </BaseButton>
        <slot name="additional-buttons" />
      </div>
    </form>
  </Form>
</template>

<style lang="scss">
.base-form {
  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.base-form__buttons {
  display: flex;
  gap: 30px;

  @include phone {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
