<template>
  <div class="profile-demo">
    <UserProfileCard />
  </div>
</template>

<script setup lang="ts">
import UserProfileCard from "./UserProfileCard.vue";
</script>

<style scoped>
.profile-demo {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f0f2f5;
}
</style>
