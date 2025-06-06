<script setup lang="ts">
// imports
import { computed, ref } from 'vue';
import { OnClickOutside } from '@vueuse/components';
import { Field, ErrorMessage } from 'vee-validate';

import BaseIcon from '@components/base/icon/BaseIcon.vue';

import type { PropType } from 'vue';
import type { ISchemaItem, ISelectItem } from '@models/schema';

// props
const props = defineProps({
  schema: {
    type: Object as PropType<ISchemaItem>,
    required: true,
  },
  list: {
    type: Array as PropType<ISelectItem[]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const modelValue = defineModel({
  type: Object as PropType<string | number>,
  required: true,
});

// refs and computed
const opened = ref<boolean>(false);

const list = computed(() => {
  return props.list;
});

const selectedItem = computed(() => {
  let currentItem = null;
  if (list.value) {
    list.value.forEach((item) => {
      if (item.value === modelValue.value) {
        currentItem = item.value;
      }
    });
  }
  return currentItem;
});

// functions
function isItemSelected(currentItem: ISelectItem) {
  return selectedItem.value === currentItem.value;
}

function changeValue(event: Event) {
  const result = list.value.find(
    (item) =>
      String((event.target as HTMLInputElement).value) === String(item.value),
  );

  if (result) {
    modelValue.value = result.value;
  }
}

function selectItem(item: ISelectItem) {
  modelValue.value = item.value;
  close();
}

function toggle() {
  if (props.schema.disabled) {
    return;
  }

  opened.value = !opened.value;
}

function close() {
  opened.value = false;
}
</script>

<template>
  <OnClickOutside @trigger="close">
    <div :class="['base-select', { 'base-select--disabled': disabled }]">
      <Field
        class="base-select__wrap"
        :name="schema.name"
        :type="schema.type ?? 'text'"
        :model-value="modelValue"
        @change="changeValue"
      >
        <label v-if="schema.label" class="base-select__label" @click="toggle">
          {{ schema.label }}
        </label>
        <div
          :class="[
            'base-select__control',
            { active: opened },
            { disabled: schema.disabled },
          ]"
          @click="toggle"
        >
          <template v-if="selectedItem">{{ selectedItem }}</template>
          <template v-else-if="!selectedItem && schema.placeholder">
            <span class="base-select__control-placeholder">{{
              schema.placeholder
            }}</span>
          </template>
          <template v-else>
            <span class="base-select__control-empty"></span>
          </template>
          <BaseIcon icon="arrow-down" class="base-select__toggler" />
        </div>
        <div v-show="opened" class="base-select__dropdown">
          <ul class="base-select__list">
            <li
              v-for="item in list"
              :key="item.id"
              :class="[
                'base-select__item',
                { 'base-select__item--active': isItemSelected(item) },
              ]"
              @click="selectItem(item)"
            >
              <span>{{ item.title }}</span>
            </li>
          </ul>
        </div>
      </Field>
      <ErrorMessage class="base-select__error" :name="schema.name ?? ''" />
    </div>
  </OnClickOutside>
</template>

<style lang="scss">
.base-select {
  position: relative;

  &--disabled {
    .base-select__control {
      pointer-events: none;
    }
  }
}

.base-select__label {
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

.base-select__control {
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

  cursor: pointer;

  transition: $base-transition;

  &:hover:not(&.disabled) {
    border-bottom: 1px solid $grey;

    .base-select__label {
      color: $grey;
    }

    .base-select__toggler {
      color: $grey;
    }
  }

  &.active {
    border-bottom: 1px solid $grey;

    .base-select__label {
      color: $grey;
    }

    .base-select__toggler {
      color: $grey;
      transform: rotate(180deg);
    }
  }

  &.disabled {
    border-bottom: 1px dashed $grey;

    .base-select__label {
      color: $grey;
    }

    .base-select__value {
      color: $grey;
    }

    .base-select__placeholder {
      color: $grey;
    }

    .base-select__toggler {
      color: $grey;
    }
  }
}

.base-select__control-placeholder {
  color: $grey;
}

.base-select__dropdown {
  position: absolute;
  z-index: 8;
  top: calc(100% + 4px);
  right: 0;

  box-sizing: border-box;
  width: 100%;
  min-width: 220px;

  border-radius: 4px;

  background: $white;
  box-shadow:
    0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.base-select__list {
  @include list-reset;
  @include no-scrollbar;
  max-height: 285px;
  overflow-y: auto;
}

.base-select__item {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 9px 12px;

  color: $white;
  background-color: $grey;

  cursor: pointer;

  transition: $base-transition;

  &:hover,
  &--active {
    color: $secondary;
    background-color: $white;
  }
}

.base-select__error {
  display: block;
  margin-top: 3px;

  font-size: 12px;
  font-weight: 400;
  line-height: 16.8px;
  letter-spacing: 0.4px;

  color: $error;
}
</style>
