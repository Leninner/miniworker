<template>
  <form class="space-y-6" @submit.prevent="$emit('submit')">
    <FormErrorMessage :message="errorMessage" />
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import FormErrorMessage from "./FormErrorMessage.vue";

defineProps({
  errorMessage: {
    type: String,
    default: "",
  },
});

defineEmits(["submit"]);
</script>
