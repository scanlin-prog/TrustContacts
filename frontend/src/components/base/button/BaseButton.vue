<script setup lang="ts">
// imports
import { computed, toRefs } from 'vue';

import type { PropType } from 'vue';

// props
const props = defineProps({
  buttonType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  secondary: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  transparented: {
    type: Boolean,
    default: false,
  },
  full: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['follow']);

const {
  buttonType,
  disabled,
  primary,
  secondary,
  bordered,
  transparented,
  full,
} = toRefs(props);

// refs
const buttonClasses = computed(() => ({
  [`btn--primary`]: primary.value,
  [`btn--secondary`]: secondary.value,
  [`btn--bordered`]: bordered.value,
  [`btn--transparented`]: transparented.value,
  [`btn--full`]: full.value,
}));

// functions
function onLinkClick() {
  emit('follow');
}
</script>

<template>
  <button
    class="btn"
    :class="buttonClasses"
    :disabled="disabled"
    :type="buttonType"
    @click="onLinkClick"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss">
.btn {
  @include button-reset;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 14px 21px;

  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  text-decoration: none;

  border-radius: 10px;

  box-sizing: border-box;
  transition: $base-transition;

  &:disabled {
    color: $black;
    background-color: $grey;
  }

  &--full {
    width: 100%;
  }

  &--primary {
    color: $white;
    background-color: $primary;

    &:hover {
      color: $white;
      background-color: #3a96c4;
    }
  }

  &--secondary {
    border: 1px solid $secondary;

    color: $white;
    background-color: transparent;

    &:hover {
      color: $white;
      background-color: $secondary;
    }
  }

  &--bordered {
    border: 2px solid $grey;

    color: $grey;
  }

  &--transparented {
    color: $primary;
    background-color: transparent;
  }
}
</style>
