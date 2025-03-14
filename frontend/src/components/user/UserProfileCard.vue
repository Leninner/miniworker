<template>
  <div class="profile-card">
    <div class="profile-header">
      <Avatar
        :avatar="user.avatar"
        :alt="'User avatar'"
        :isOnline="user.isOnline"
        :showStatus="true"
      />
      <UserInfo :name="user.name" :role="user.role" />
      <ActionButtons />
    </div>

    <SharedSection
      title="Shared Files"
      :showViewAll="true"
      viewAllText="View All"
    >
      <FileItem v-for="file in sharedFiles" :key="file.id" :file="file" />
    </SharedSection>

    <SharedSection
      title="Shared Links"
      :showViewAll="true"
      viewAllText="View All"
    >
      <LinkItem v-for="link in sharedLinks" :key="link.id" :link="link" />
    </SharedSection>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserInfo from "./UserInfo.vue";
import type { User } from "@/types";
import Avatar from "../ui/Avatar.vue";
import ActionButtons from "../ui/ActionButton.vue";
import FileItem from "../FileItem.vue";
import LinkItem from "../LinkItem.vue";
import type { FileData, LinkData } from "@/types/profile";
// Mock data
const user = ref<User>({
  name: "Annette Black",
  role: "Student",
  avatar: "https://randomuser.me/api/portraits/women/67.jpg",
  isOnline: true,
  email: "annette.black@example.com",
  id: "1",
});

const sharedFiles = ref<FileData[]>([
  {
    id: 1,
    name: "Homework 1.doc",
    type: "document",
    date: "Dec 30, 2019 07:52",
    size: "3.3 Mb",
  },
  {
    id: 2,
    name: "Research.pdf",
    type: "pdf",
    date: "Dec 4, 2019 21:42",
    size: "4.2 Mb",
  },
  {
    id: 3,
    name: "Draft.pdf",
    type: "pdf",
    date: "Dec 10, 2019 05:18",
    size: "7.3 Mb",
  },
  {
    id: 4,
    name: "Image1.png",
    type: "image",
    date: "Feb 5, 2019 15:28",
    size: "5.2 Mb",
  },
]);

const sharedLinks = ref<LinkData[]>([
  {
    id: 1,
    url: "https://mario.net",
    date: "November 28, 2015",
    time: "8:20 am",
  },
  {
    id: 2,
    url: "http://kara.org",
    date: "May 5, 2012",
    time: "5:45 am",
  },
  {
    id: 3,
    url: "http://roslyn.info",
    date: "February 12, 2013",
    time: "7:30 am",
  },
  {
    id: 4,
    url: "https://clifton.info",
    date: "February 20, 2012",
    time: "6:45 am",
  },
]);
</script>

<style scoped>
.profile-card {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
}

.profile-header {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
}
</style>
