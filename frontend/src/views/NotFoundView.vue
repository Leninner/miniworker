<template>
  <AppLayout>
    <div class="text-center py-16">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p class="text-2xl text-gray-600 mb-8">Page not found</p>
      <p class="text-gray-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link to="/" class="btn btn-primary">Go back home</router-link>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/AppLayout.vue";
</script>
