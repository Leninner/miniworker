<template>
  <ul role="list" class="divide-y divide-neutral-200">
    <li
      v-for="project in projects"
      :key="project.id"
      class="list-item list-item-hover"
    >
      <router-link :to="`/projects/${project.id}`" class="block">
        <div class="px-2 py-2 sm:px-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-lg font-medium text-accent-600 mb-0">
              {{ project.title }}
            </p>
            <div class="ml-2 flex-shrink-0 flex">
              <StatusBadge :status="project.status" />
            </div>
          </div>
          <div class="mt-3 sm:flex sm:justify-between">
            <div class="sm:flex items-center">
              <p
                v-if="showAgent && project.agent"
                class="flex items-center text-sm text-neutral-600 mb-0"
              >
                <svg
                  class="flex-shrink-0 mr-2 h-5 w-5 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span class="font-medium">Agent:</span>
                {{ project.agent?.name || "Unknown" }}
              </p>
              <p
                v-if="showStudent && project.student"
                class="flex items-center text-sm text-neutral-600 mb-0"
              >
                <svg
                  class="flex-shrink-0 mr-2 h-5 w-5 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span class="font-medium mr-1">Student:</span>
                {{ project.student?.firstName }}
                {{ project.student?.lastName }}
              </p>
            </div>
            <div
              class="mt-3 flex items-center text-sm text-neutral-600 sm:mt-0"
            >
              <svg
                class="flex-shrink-0 mr-2 h-5 w-5 text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p class="mb-0">
                <span class="font-medium">Due:</span>
                {{ formatDate(project.endDate) }}
              </p>
            </div>
          </div>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import StatusBadge from "../../../components/ui/StatusBadge.vue";

interface Project {
  id: string;
  title: string;
  status: string;
  agent?: {
    name: string;
  };
  student?: {
    firstName: string;
    lastName: string;
  };
  endDate: Date;
  createdBy?: string;
  group?: string;
}

interface Props {
  projects: Project[];
  showAgent?: boolean;
  showStudent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showAgent: false,
  showStudent: false,
});

function formatDate(date: Date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>
