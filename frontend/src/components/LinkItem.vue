<template>
  <div class="link-item">
    <div class="link-icon">
      <slot name="icon">
        <svg
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
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
          ></path>
          <path
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
          ></path>
        </svg>
      </slot>
    </div>
    <div class="link-info">
      <p class="link-url">{{ link.url }}</p>
      <p class="link-date">{{ link.date }}</p>
    </div>
    <div class="link-time">{{ link.time }}</div>
  </div>
</template>

<script setup lang="ts">
interface LinkData {
  id: number;
  url: string;
  date: string;
  time: string;
}

defineProps<{
  link: LinkData;
}>();
</script>

<style scoped>
.link-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.link-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: #e8e0ff;
  color: #7b61ff;
}

.link-info {
  flex: 1;
}

.link-url {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.link-date {
  margin: 4px 0 0;
  font-size: 12px;
  color: #888;
}

.link-time {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}
</style>
