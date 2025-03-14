<template>
  <div
    class="grid grid-cols-1 gap-6"
    :class="{
      'sm:grid-cols-2': columns === 2,
      'sm:grid-cols-3': columns === 3,
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  columns: {
    type: Number,
    default: 1,
    validator: (value: number) => [1, 2, 3].includes(value),
  },
});
</script>
