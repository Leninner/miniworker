<template>
  <button class="action-btn" :class="buttonClass">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  buttonClass?: string;
}>();
</script>

<style scoped>
.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  background-color: #e8e0ff;
  color: #7b61ff;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
