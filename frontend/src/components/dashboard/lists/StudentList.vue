<template>
  <div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              Group
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr v-for="student in students" :key="student.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div
                    class="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-800 font-medium"
                  >
                    {{ getInitials(student.firstName, student.lastName) }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-neutral-900">
                    {{ student.firstName }} {{ student.lastName }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-neutral-500">{{ student.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-neutral-500">
                {{ student.group?.name || "Not assigned" }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': student.active,
                  'bg-red-100 text-red-800': !student.active,
                }"
              >
                {{ student.active ? "Active" : "Inactive" }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <button
                @click="$emit('edit-student', student)"
                class="text-accent-600 hover:text-accent-900 mr-2"
              >
                Edit
              </button>
              <button
                @click="$emit('remove-student', student)"
                class="text-red-600 hover:text-red-900"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="students.length === 0" class="text-center py-8 text-neutral-500">
      No students enrolled in this course yet.
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Group {
  id: string;
  name: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  group?: Group;
}

interface Props {
  students: Student[];
}

defineProps<Props>();
defineEmits<{
  (e: "edit-student", student: Student): void;
  (e: "remove-student", student: Student): void;
}>();

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}
</script>
