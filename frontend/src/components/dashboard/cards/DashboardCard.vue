<template>
  <div class="bg-white shadow overflow-hidden rounded-lg">
    <div
      class="px-6 py-5 sm:px-8 flex justify-between items-center border-b border-neutral-200"
    >
      <div>
        <h2 class="text-xl font-bold text-neutral-900 mb-1">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-sm text-neutral-500 mb-0">
          {{ subtitle }}
        </p>
      </div>
      <slot name="actions"></slot>
    </div>
    <div v-if="loading" class="p-8 text-center text-neutral-500">
      <div class="flex justify-center mb-4">
        <div class="spinner"></div>
      </div>
      Loading...
    </div>
    <div v-else-if="isEmpty" class="px-8 py-10 text-center">
      <p class="text-neutral-500 font-medium mb-2">
        {{ emptyMessage }}
      </p>
      <p v-if="emptyDescription" class="text-sm text-neutral-400">
        {{ emptyDescription }}
      </p>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  loading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isEmpty: false,
  emptyMessage: "No data available",
  emptyDescription: "",
});
</script>
