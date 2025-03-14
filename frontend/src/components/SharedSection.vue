<template>
  <div class="shared-section">
    <SectionHeader
      :title="title"
      :showViewAll="showViewAll"
      :viewAllText="viewAllText"
    />
    <div class="items-list">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionHeader from "./SectionHeader.vue";

defineProps<{
  title: string;
  showViewAll?: boolean;
  viewAllText?: string;
}>();
</script>

<style scoped>
.shared-section {
  padding: 16px 24px;
  border-top: 1px solid #eaeaea;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
