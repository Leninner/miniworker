<template>
  <div class="file-item">
    <div class="file-icon" :class="getFileIconClass(file.type)">
      <slot name="icon">
        <svg
          v-if="file.type === 'document'"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          ></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <svg
          v-else-if="file.type === 'pdf'"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          ></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <svg
          v-else-if="file.type === 'image'"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </slot>
    </div>
    <div class="file-info">
      <p class="file-name">{{ file.name }}</p>
      <p class="file-date">{{ file.date }}</p>
    </div>
    <div class="file-size">{{ file.size }}</div>
  </div>
</template>

<script setup lang="ts">
interface FileData {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
}

const props = defineProps<{
  file: FileData;
}>();

const getFileIconClass = (type: string) => {
  return {
    "document-icon": type === "document",
    "pdf-icon": type === "pdf",
    "image-icon": type === "image",
  };
};
</script>

<style scoped>
.file-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.file-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.document-icon {
  background-color: #e3f2fd;
  color: #2196f3;
}

.pdf-icon {
  background-color: #ffebee;
  color: #f44336;
}

.image-icon {
  background-color: #e8f5e9;
  color: #4caf50;
}

.file-info {
  flex: 1;
}

.file-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.file-date {
  margin: 4px 0 0;
  font-size: 12px;
  color: #888;
}

.file-size {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}
</style>
