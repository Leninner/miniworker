<template>
  <div class="container mx-auto px-4 py-8 max-w-md">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="spinner"></div>
    </div>
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
    >
      <h1 class="text-2xl font-bold text-red-700 mb-4">Enrollment Error</h1>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <router-link to="/dashboard" class="btn btn-primary">
        Return to Dashboard
      </router-link>
    </div>
    <div
      v-else-if="success"
      class="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
    >
      <h1 class="text-2xl font-bold text-green-700 mb-4">
        Enrollment Successful!
      </h1>
      <p class="text-green-600 mb-4">
        You have successfully enrolled in <strong>{{ course.name }}</strong
        >.
      </p>
      <router-link to="/dashboard" class="btn btn-primary">
        Go to Dashboard
      </router-link>
    </div>
    <div v-else class="bg-white shadow overflow-hidden rounded-lg">
      <div class="px-6 py-5 sm:px-8 border-b border-neutral-200">
        <h1 class="text-2xl font-bold text-neutral-900 mb-1">
          Course Enrollment
        </h1>
        <p class="text-sm text-neutral-500 mb-0">
          You are about to enroll in the following course
        </p>
      </div>
      <div class="p-6 sm:p-8">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-neutral-900 mb-2">
            {{ course.name }}
          </h2>
          <p class="text-sm text-neutral-500 mb-1">{{ course.code }}</p>
          <p class="text-neutral-700 mb-4">{{ course.description }}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <div class="text-sm font-medium text-neutral-500">Start Date</div>
              <div class="mt-1 text-sm text-neutral-900">
                {{ formatDate(course.startDate) }}
              </div>
            </div>
            <div>
              <div class="text-sm font-medium text-neutral-500">End Date</div>
              <div class="mt-1 text-sm text-neutral-900">
                {{ formatDate(course.endDate) }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <router-link
            to="/dashboard"
            class="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            Cancel
          </router-link>
          <button
            @click="enrollInCourse"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
}

const route = useRoute();
const router = useRouter();
const courseId = computed(() => route.params.courseId as string);

const loading = ref(true);
const error = ref<string | null>(null);
const success = ref(false);
const course = ref<Course>({
  id: "",
  name: "",
  code: "",
  description: "",
  startDate: "",
  endDate: "",
});

onMounted(async () => {
  // Fetch course data
  // This is a placeholder - in a real implementation, you would fetch from your API
  loading.value = true;

  try {
    // Simulate API call
    setTimeout(() => {
      // Mock course data
      if (courseId.value) {
        course.value = {
          id: courseId.value,
          name: "Introduction to Computer Science",
          code: "CS101",
          description: "An introductory course to computer science principles",
          startDate: "2023-09-01",
          endDate: "2023-12-15",
        };
        loading.value = false;
      } else {
        error.value = "Invalid course ID";
        loading.value = false;
      }
    }, 1000);
  } catch (err) {
    error.value = "Failed to load course information";
    loading.value = false;
  }
});

function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function enrollInCourse() {
  loading.value = true;

  // Simulate API call to enroll in course
  setTimeout(() => {
    // In a real implementation, you would make an API call to enroll the student
    success.value = true;
    loading.value = false;
  }, 1500);
}
</script>
