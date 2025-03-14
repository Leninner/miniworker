<template>
  <span class="rounded-full px-2 py-1 text-sm font-medium" :class="statusClass">
    {{ formattedStatus }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  status: string;
}

const props = defineProps<Props>();

const statusClass = computed(() => {
  switch (props.status) {
    case "pending":
      return "bg-yellow-500 text-white";
    case "in_progress":
      return "bg-blue-500 text-white";
    case "completed":
      return "bg-green-500 text-white";
    case "failed":
      return "bg-red-500 text-white";
    default:
      return "bg-neutral-500 text-white";
  }
});

const formattedStatus = computed(() => {
  if (!props.status) return "Unknown";
  return props.status
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
});
</script>
