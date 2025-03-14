<template>
  <div class="bg-white shadow overflow-hidden rounded-lg">
    <div class="px-6 py-5 sm:px-8 border-b border-neutral-200">
      <h2 class="text-xl font-bold text-neutral-900 mb-1">
        {{ isEditing ? "Edit Group" : "Create New Group" }}
      </h2>
      <p class="text-sm text-neutral-500 mb-0">
        {{
          isEditing
            ? "Update group details"
            : "Add a new group for your students"
        }}
      </p>
    </div>
    <div class="p-6 sm:p-8">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-neutral-700"
            >
              Group Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="shadow-sm focus:ring-accent-500 focus:border-accent-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                placeholder="e.g. Team Alpha"
              />
            </div>
          </div>

          <div>
            <label
              for="description"
              class="block text-sm font-medium text-neutral-700"
            >
              Description
            </label>
            <div class="mt-1">
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="shadow-sm focus:ring-accent-500 focus:border-accent-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                placeholder="Provide a brief description of the group"
              ></textarea>
            </div>
          </div>

          <div v-if="availableStudents.length > 0">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Add Students to Group
            </label>
            <div
              class="max-h-60 overflow-y-auto border border-neutral-300 rounded-md p-2"
            >
              <div
                v-for="student in availableStudents"
                :key="student.id"
                class="flex items-center p-2 hover:bg-neutral-50 rounded-md"
              >
                <input
                  :id="`student-${student.id}`"
                  v-model="selectedStudents"
                  :value="student.id"
                  type="checkbox"
                  class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300 rounded"
                />
                <label
                  :for="`student-${student.id}`"
                  class="ml-3 block text-sm text-neutral-700"
                >
                  {{ student.firstName }} {{ student.lastName }}
                </label>
              </div>
            </div>
            <p
              v-if="availableStudents.length === 0"
              class="mt-2 text-sm text-neutral-500"
            >
              No available students to add to this group.
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('cancel')"
              class="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              {{ isEditing ? "Update Group" : "Create Group" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from "vue";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Group {
  id?: string;
  name: string;
  description: string;
  studentIds?: string[];
}

interface Props {
  group?: Group;
  isEditing?: boolean;
  availableStudents: Student[];
  currentStudentIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  currentStudentIds: () => [],
});

const emit = defineEmits<{
  (e: "submit", data: { group: Group; studentIds: string[] }): void;
  (e: "cancel"): void;
}>();

const form = reactive<Group>({
  name: "",
  description: "",
});

const selectedStudents = ref<string[]>([]);

onMounted(() => {
  if (props.group && props.isEditing) {
    // Clone the group object to avoid mutating props
    Object.assign(form, props.group);

    // Set selected students if editing
    if (props.currentStudentIds) {
      selectedStudents.value = [...props.currentStudentIds];
    }
  }
});

function handleSubmit() {
  emit("submit", {
    group: { ...form },
    studentIds: selectedStudents.value,
  });
}
</script>
