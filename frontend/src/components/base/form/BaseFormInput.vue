<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import { vMaska } from 'maska/vue';

import type { PropType } from 'vue';
import type { ISchemaItem } from '@models/schema';

type TModelValue = string | number;

const props = defineProps({
  schema: {
    type: Object as PropType<ISchemaItem>,
    required: true,
  },
  formatted: {
    type: Boolean,
    default: false,
  },
  hideErrorMessage: {
    type: Boolean,
    default: false,
  },
});

const modelValue = defineModel({
  type: Object as PropType<TModelValue>,
  required: true,
});

const emit = defineEmits(['update:modelValue', 'change']);

const getValue = (modifiedValue: TModelValue) => normalize(modifiedValue);

const normalize = (modifiedValue: TModelValue) => {
  if (!modifiedValue || !props.formatted) return modifiedValue;

  const newValue = parseFloat(modifiedValue.toString().replace(/[^\d\.]/g, ''));

  return isNaN(newValue) ? 0 : newValue;
};

function onChange(event: Event) {
  emit('update:modelValue', getValue((event.target as HTMLInputElement).value));
  emit('change', getValue((event.target as HTMLInputElement).value));
}

function onInput(event: Event) {
  emit('update:modelValue', getValue((event.target as HTMLInputElement).value));
  emit('change', getValue((event.target as HTMLInputElement).value));
}
</script>

<template>
  <div class="base-input">
    <Field
      v-slot="{ meta }"
      :name="schema.name"
      :model-value="modelValue"
      :type="schema.type ?? 'text'"
    >
      <div
        class="base-input__wrap"
        :class="{
          'base-input__wrap--error': !meta.valid && meta.validated,
          'base-input__wrap--disabled': schema.disabled,
        }"
      >
        <label v-if="schema.label" class="base-input__label">{{
          schema.label
        }}</label>
        <input
          :id="schema.name"
          v-model.trim="modelValue"
          v-maska
          class="base-input__control"
          :placeholder="schema.placeholder"
          :name="schema.name"
          :type="schema.type"
          :disabled="schema.disabled"
          :data-maska="schema.mask ?? ''"
          :data-maska-tokens="schema.maskToken ?? ''"
          @change="onChange"
          @input="onInput"
        />
      </div>
    </Field>
    <ErrorMessage
      v-if="!hideErrorMessage"
      class="base-input__error"
      :name="schema.name"
    />
  </div>
</template>

<style lang="scss" scoped>
input:-webkit-autofill {
  transition: all 5000s ease-in-out 0s;
}

.base-input {
  position: relative;
  width: 100%;
}

.base-input__wrap {
  position: relative;

  &--error {
    .base-input__control {
      border-bottom: 1px solid $error;
    }
  }

  &--disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

.base-input__label {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  display: block;

  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: 0.15px;

  color: $white;
}

.base-input__control {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 18px 0 6px;

  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;

  border: 0;
  border-bottom: 1px solid $grey;
  border-radius: 0;

  color: $secondary;
  background-color: transparent;

  transition: $base-transition;

  &::placeholder {
    color: $grey;
  }

  &.disabled {
    border-bottom: 1px dashed $grey;

    .base-input__label {
      color: $grey;
    }
  }
}

.base-input__error {
  display: block;
  margin-top: 3px;

  font-size: 12px;
  font-weight: 400;
  line-height: 16.8px;
  letter-spacing: 0.4px;

  color: $error;
}
</style>
