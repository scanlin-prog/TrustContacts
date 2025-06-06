<script setup lang="ts">
//imports
import { computed } from 'vue';

// props
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
});

// refs
const icon = computed(() => props.icon);
</script>

<template>
  <div class="icon">
    <svg>
      <use :href="`#${icon}`"></use>
    </svg>
  </div>
</template>

<style lang="scss">
.icon {
  flex-shrink: 0;
  display: block;

  width: 24px;
  height: 24px;
}

.icon svg {
  display: block;
  width: 100% !important;
  height: 100% !important;
  margin-bottom: 0;
}
</style>
