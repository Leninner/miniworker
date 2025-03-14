<template>
  <div class="avatar-container">
    <img :src="avatar" :alt="alt" class="avatar" />
    <div
      v-if="showStatus"
      class="status-indicator"
      :class="{ online: isOnline }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  avatar: string;
  alt?: string;
  isOnline?: boolean;
  showStatus?: boolean;
}>();
</script>

<style scoped>
.avatar-container {
  position: relative;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  border: 2px solid white;
}

.status-indicator.online {
  background-color: #4caf50;
}
</style>
