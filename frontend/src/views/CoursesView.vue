<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-900 mb-8">Courses</h1>
    <p class="text-neutral-600 mb-4">
      Manage your courses from the dashboard. You will be redirected shortly...
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // Redirect to dashboard after a short delay
  setTimeout(() => {
    router.push("/dashboard");
  }, 1500);
});
</script>
