<template>
  <ul role="list" class="divide-y divide-neutral-200">
    <li
      v-for="course in courses"
      :key="course.id"
      class="list-item list-item-hover"
    >
      <router-link :to="`/courses/${course.id}`" class="block">
        <div class="px-2 py-2 sm:px-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-lg font-medium text-accent-600 mb-0">
              {{ course.name }}
            </p>
            <div class="ml-2 flex-shrink-0 flex">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': course.active,
                  'bg-red-100 text-red-800': !course.active,
                }"
              >
                {{ course.active ? "Active" : "Inactive" }}
              </span>
            </div>
          </div>
          <div class="mt-3 sm:flex sm:justify-between">
            <div class="sm:flex items-center">
              <p class="flex items-center text-sm text-neutral-600 mb-0">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span class="font-medium">Code:</span>
                {{ course.code }}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p class="mb-0">
                <span class="font-medium">Students:</span>
                {{ course.studentCount }}
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

interface Course {
  id: string;
  name: string;
  code: string;
  active: boolean;
  studentCount: number;
}

interface Props {
  courses: Course[];
}

defineProps<Props>();
</script>
