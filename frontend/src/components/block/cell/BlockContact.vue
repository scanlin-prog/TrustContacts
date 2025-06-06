<script setup lang="ts">
// imports
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';

import BaseButton from '@components/base/button/BaseButton.vue';
import BaseIcon from '@components/base/icon/BaseIcon.vue';

import { useAppStore } from '@store/app';

import type { PropType } from 'vue';
import type { IContact } from '@models/contact';

// routes and stores
const router = useRouter();

// props
const props = defineProps({
  data: {
    type: Object as PropType<IContact>,
    required: true,
  },
});

// refs
const { id, name, phone, email, tags, lastInteractive } = toRefs(props.data);

const stringTags = computed(() => {
  return tags.value.join(' ');
});

// functions
function editContact() {
  router.push({ path: `/edit-contact/${id.value}` });
}
</script>

<template>
  <div class="contact">
    <p class="contact__title">{{ name }}</p>
    <p class="contact__value">{{ phone }}</p>
    <p class="contact__value">{{ email }}</p>
    <p class="contact__value">{{ stringTags }}</p>
    <p class="contact__value">{{ lastInteractive }}</p>
    <div class="contact__controls">
      <BaseButton class="contact__control" @click="editContact">
        <BaseIcon icon="edit" />
      </BaseButton>
      <BaseButton class="contact__control">
        <BaseIcon icon="trash" />
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss">
.contact {
  display: grid;
  grid-template-columns: repeat(5, 1fr) 100px;
}

.contact__title,
.contact__value {
  padding: 10px 12px;

  color: $white;
  border: 1px solid $grey;
}

.contact__value {
  color: $secondary;
}

.contact__controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact__control {
  padding: 10px;
  color: $white;

  .icon {
    width: 16px;
    height: 16px;
  }
}
</style>
