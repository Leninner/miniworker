<template>
  <div class="grid grid-cols-1 gap-8">
    <div class="bg-white shadow rounded-lg px-6 py-8 sm:px-8">
      <h2 class="text-xl font-bold text-neutral-900 mb-4">Admin Dashboard</h2>
      <p class="text-neutral-600 mb-6">Manage the platform</p>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link
          to="/admin"
          class="btn btn-primary text-center py-5 text-lg"
        >
          Manage Users
        </router-link>
        <router-link
          to="/agents"
          class="btn btn-primary text-center py-5 text-lg"
        >
          Manage Agents
        </router-link>
        <button
          @click="$emit('generateReports')"
          class="btn btn-primary text-center py-5 text-lg cursor-pointer"
        >
          Generate Reports
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: "generateReports"): void;
}>();
</script>
