<template>
  <div class="group-members">
    <h3
      class="text-lg font-medium leading-6 text-gray-900 mb-2"
      v-if="showTitle"
    >
      {{ title || "Group Members" }}
    </h3>

    <div v-if="loading" class="flex justify-center py-4">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
      ></div>
    </div>

    <div
      v-else-if="!members || members.length === 0"
      class="text-gray-500 text-sm"
    >
      No members in this group.
    </div>

    <ul v-else class="space-y-3">
      <li v-for="member in members" :key="member.id" class="flex items-center">
        <div class="flex-shrink-0">
          <img
            v-if="member.profilePicture"
            :src="member.profilePicture"
            alt="Profile"
            class="w-8 h-8 rounded-full"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <span class="text-gray-600 text-xs">{{
              getMemberInitials(member)
            }}</span>
          </div>
        </div>
        <div class="ml-3">
          <span class="text-sm font-medium text-gray-700">{{
            getMemberFullName(member)
          }}</span>
          <span
            v-if="member.role && showRole"
            class="ml-2 text-xs text-gray-500"
            >{{ member.role }}</span
          >
        </div>
        <div v-if="isEditable && canRemove" class="ml-auto">
          <button
            @click="$emit('remove-member', member.id)"
            class="text-red-600 hover:text-red-800 text-sm"
            aria-label="Remove member"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </li>
    </ul>

    <div v-if="isEditable && canAdd" class="mt-4">
      <button
        @click="$emit('add-member')"
        class="flex items-center text-blue-600 hover:text-blue-800 text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Member
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
  canAdd: {
    type: Boolean,
    default: false,
  },
  canRemove: {
    type: Boolean,
    default: false,
  },
  showRole: {
    type: Boolean,
    default: false,
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
});

defineEmits(["add-member", "remove-member"]);

function getMemberInitials(member) {
  if (!member) return "?";

  let initials = "";
  if (member.firstName) initials += member.firstName.charAt(0);
  if (member.lastName) initials += member.lastName.charAt(0);

  return initials || "?";
}

function getMemberFullName(member) {
  if (!member) return "Unknown";

  let name = "";
  if (member.firstName) name += member.firstName;
  if (member.lastName) name += (name ? " " : "") + member.lastName;

  return name || "Unknown";
}
</script>
