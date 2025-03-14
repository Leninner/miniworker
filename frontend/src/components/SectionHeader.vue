<template>
  <div class="section-header">
    <h3>{{ title }}</h3>
    <a v-if="showViewAll" href="#" class="view-all">{{ viewAllText }}</a>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  showViewAll?: boolean;
  viewAllText?: string;
}>();
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.view-all {
  font-size: 14px;
  color: #7b61ff;
  text-decoration: none;
}
</style>
