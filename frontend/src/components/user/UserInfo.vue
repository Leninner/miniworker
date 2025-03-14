<template>
  <div class="user-info">
    <h2 class="user-name">{{ name }}</h2>
    <p class="user-role">{{ role }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  role: string;
}>();
</script>

<style scoped>
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-name {
  margin: 8px 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.user-role {
  margin: 0 0 16px;
  font-size: 14px;
  color: #666;
}
</style>
