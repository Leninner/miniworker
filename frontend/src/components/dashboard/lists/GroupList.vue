<template>
  <div class="space-y-6">
    <div
      v-for="group in groups"
      :key="group.id"
      class="bg-white shadow overflow-hidden rounded-lg"
    >
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-neutral-900">
            {{ group.name }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-neutral-500">
            {{ group.students.length }} students
          </p>
        </div>
        <div>
          <button
            @click="$emit('edit-group', group)"
            class="text-accent-600 hover:text-accent-900 mr-2"
          >
            Edit
          </button>
          <button
            @click="$emit('delete-group', group)"
            class="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      </div>
      <div class="border-t border-neutral-200">
        <ul role="list" class="divide-y divide-neutral-200">
          <li
            v-for="student in group.students"
            :key="student.id"
            class="px-4 py-4 sm:px-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-800 font-medium"
                >
                  {{ getInitials(student.firstName, student.lastName) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-neutral-900">
                    {{ student.firstName }} {{ student.lastName }}
                  </div>
                  <div class="text-sm text-neutral-500">
                    {{ student.email }}
                  </div>
                </div>
              </div>
              <button
                @click="$emit('remove-from-group', { student, group })"
                class="text-red-600 hover:text-red-900 text-sm"
              >
                Remove from group
              </button>
            </div>
          </li>
          <li
            v-if="group.students.length === 0"
            class="px-4 py-4 sm:px-6 text-center text-neutral-500"
          >
            No students in this group yet.
          </li>
        </ul>
      </div>
    </div>
    <div v-if="groups.length === 0" class="text-center py-8 text-neutral-500">
      No groups created for this course yet.
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Group {
  id: string;
  name: string;
  students: Student[];
}

interface Props {
  groups: Group[];
}

defineProps<Props>();
defineEmits<{
  (e: "edit-group", group: Group): void;
  (e: "delete-group", group: Group): void;
  (e: "remove-from-group", data: { student: Student; group: Group }): void;
}>();

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}
</script>
