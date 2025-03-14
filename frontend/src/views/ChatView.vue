<template>
  <MainLayout>
    <div class="chat-container">
      <!-- Left Sidebar - Contacts and Chats -->
      <div class="chat-sidebar">
        <!-- Search -->
        <div class="search-container">
          <div class="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search Messages"
            class="search-input"
          />
        </div>

        <!-- Contacts Section -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Contacts</h2>
            <a href="#" class="view-all">View All</a>
          </div>
          <div class="contacts-list">
            <div
              v-for="contact in contacts"
              :key="contact.id"
              class="contact-item"
              :class="{ active: contact.id === activeContact }"
            >
              <img
                :src="contact.avatar"
                alt="Contact avatar"
                class="contact-avatar"
              />
            </div>
          </div>
        </div>

        <!-- Chats Section -->
        <div class="section">
          <div class="chat-tabs">
            <button class="tab-btn active">Students</button>
            <button class="tab-btn">Group</button>
          </div>
          <div class="chats-list">
            <div
              v-for="chat in chats"
              :key="chat.id"
              class="chat-item"
              :class="{ active: chat.id === activeChat }"
            >
              <img :src="chat.avatar" alt="Chat avatar" class="chat-avatar" />
              <div class="chat-info">
                <div class="chat-header">
                  <h3 class="chat-name">{{ chat.name }}</h3>
                  <span class="chat-time">{{ chat.lastMessageTime }}</span>
                </div>
                <p class="chat-message">{{ chat.lastMessage }}</p>
              </div>
              <div v-if="chat.unread" class="unread-badge">
                {{ chat.unread }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="chat-main">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-user">
            <img
              :src="currentChat.avatar"
              alt="Chat user avatar"
              class="user-avatar"
            />
            <div class="user-info">
              <h2 class="user-name">{{ currentChat.name }}</h2>
              <p class="user-status">{{ currentChat.status }}</p>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn">
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
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="chat-messages">
          <div class="date-separator">
            <span>1 November</span>
          </div>

          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{ outgoing: message.isOutgoing }"
          >
            <img
              v-if="!message.isOutgoing"
              :src="currentChat.avatar"
              alt="User avatar"
              class="message-avatar"
            />
            <div class="message-content">
              <div v-if="message.type === 'text'" class="message-bubble">
                <p>{{ message.content }}</p>
              </div>
              <div
                v-else-if="message.type === 'image'"
                class="message-bubble image-message"
              >
                <img
                  :src="message.content"
                  alt="Shared image"
                  class="message-image"
                />
                <p class="image-caption">{{ message.caption }}</p>
              </div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input-container">
          <button class="attachment-btn">
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
                d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
              ></path>
            </svg>
          </button>
          <input
            type="text"
            placeholder="Write your message..."
            class="chat-input"
          />
          <button class="send-btn">
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
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <!-- Right Sidebar - User Profile -->
      <div class="user-sidebar">
        <UserProfileCard />
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MainLayout from "@/components/MainLayout.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";

// Mock data for contacts
const contacts = ref([
  {
    id: 1,
    name: "Jane Cooper",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Robert Fox",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Esther Howard",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "Cameron Williamson",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Brooklyn Simmons",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
]);

// Mock data for chats
const chats = ref([
  {
    id: 1,
    name: "Darlene Robertson",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    lastMessage: "Hold on I need at least a few...",
    lastMessageTime: "05:14 pm",
    unread: 0,
    status: "Online",
  },
  {
    id: 2,
    name: "Leslie Alexander",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    lastMessage: "Are you worried about it?",
    lastMessageTime: "07:38 am",
    unread: 2,
    status: "Last seen 2h ago",
  },
  {
    id: 3,
    name: "Annette Black",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    lastMessage: "She usually has to give in to...",
    lastMessageTime: "11:49 pm",
    unread: 0,
    status: "Online",
  },
  {
    id: 4,
    name: "Arlene McCoy",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    lastMessage: "Are you ready for your big...",
    lastMessageTime: "10:36 pm",
    unread: 0,
    status: "Last seen yesterday",
  },
  {
    id: 5,
    name: "Dianne Russell",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    lastMessage: "Does he write an email?",
    lastMessageTime: "01:45 am",
    unread: 2,
    status: "Online",
  },
]);

// Active contact and chat
const activeContact = ref(3);
const activeChat = ref(3);

// Current chat (the one that's open)
const currentChat = ref(
  chats.value.find((chat) => chat.id === activeChat.value) || chats.value[0]
);

// Mock messages for the current chat
const messages = ref([
  {
    id: 1,
    isOutgoing: false,
    type: "text",
    content:
      "Hey Olivia, can you please review the latest design when you can?",
    time: "Friday 2:22pm",
  },
  {
    id: 2,
    isOutgoing: true,
    type: "text",
    content: "Sure, I'll take a look at it right away!",
    time: "Friday 2:25pm",
  },
  {
    id: 3,
    isOutgoing: false,
    type: "image",
    content: "https://via.placeholder.com/300x200",
    caption: "Latest design screenshot.jpg",
    time: "Friday 2:20pm",
  },
  {
    id: 4,
    isOutgoing: true,
    type: "text",
    content:
      "Looks great! I like the color scheme and layout. Just a few minor tweaks needed for the navigation.",
    time: "Friday 2:30pm",
  },
  {
    id: 5,
    isOutgoing: false,
    type: "text",
    content:
      "Thanks for the quick feedback! I'll make those adjustments right away.",
    time: "Friday 2:35pm",
  },
]);
</script>

<style scoped>
.chat-container {
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  height: calc(100vh - 64px);
  background-color: #f8f9fd;
  overflow: hidden;
}

/* Left Sidebar Styles */
.chat-sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-container {
  position: relative;
  padding: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8f9fd;
}

.search-icon {
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.section {
  padding: 0 16px 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
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

.contacts-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.contact-item {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.contact-item.active {
  border-color: #7b61ff;
}

.contact-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-tabs {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab-btn.active {
  color: #7b61ff;
}

.tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #7b61ff;
}

.chats-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.chat-item:hover {
  background-color: #f5f5f5;
}

.chat-item.active {
  background-color: #f0ebff;
}

.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.chat-message {
  font-size: 13px;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #7b61ff;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}

/* Main Chat Area Styles */
.chat-main {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.chat-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.user-status {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #f8f9fd;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f0ebff;
  color: #7b61ff;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.date-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
}

.date-separator span {
  background-color: #f0ebff;
  color: #7b61ff;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 70%;
}

.message.outgoing {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-bubble {
  background-color: #f0ebff;
  border-radius: 16px;
  padding: 12px 16px;
  color: #333;
  font-size: 14px;
}

.outgoing .message-bubble {
  background-color: #7b61ff;
  color: white;
}

.image-message {
  padding: 8px;
  max-width: 300px;
}

.message-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}

.image-caption {
  font-size: 12px;
  margin: 0;
  color: #666;
}

.outgoing .image-caption {
  color: #e0e0e0;
}

.message-time {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
  align-self: flex-end;
}

.outgoing .message-time {
  align-self: flex-start;
}

.chat-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.attachment-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f8f9fd;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  font-size: 14px;
  background-color: #f8f9fd;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #7b61ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Right Sidebar Styles */
.user-sidebar {
  padding: 16px;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
}

@media (max-width: 1200px) {
  .chat-container {
    grid-template-columns: 300px 1fr;
  }

  .user-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .chat-container {
    grid-template-columns: 1fr;
  }

  .chat-sidebar {
    display: none;
  }
}
</style>
