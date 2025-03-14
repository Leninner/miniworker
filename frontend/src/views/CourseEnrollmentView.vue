<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col justify-center items-center h-64">
      <div
        class="spinner-border w-12 h-12 mb-4 text-accent-600"
        role="status"
      ></div>
      <p class="text-neutral-600">{{ loadingMessage }}</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
    >
      <div class="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h1 class="text-2xl font-bold text-red-700 mb-4">Enrollment Error</h1>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <div class="flex gap-x-4">
          <button @click="retryOperation" class="btn btn-secondary">
            Try Again
          </button>
          <router-link to="/dashboard" class="btn btn-primary">
            Return to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Success State -->
    <div
      v-else-if="success"
      class="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
    >
      <div class="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-green-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 class="text-2xl font-bold text-green-700 mb-4">
          Enrollment Successful!
        </h1>
        <p class="text-green-600 mb-4">
          You have successfully enrolled in <strong>{{ course.name }}</strong
          >.
        </p>
        <div class="flex gap-x-4">
          <router-link :to="`/courses/${course.id}`" class="btn btn-secondary">
            View Course
          </router-link>
          <router-link to="/dashboard" class="btn btn-primary">
            Go to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Course Information -->
    <div v-else class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div
        class="px-6 py-5 sm:px-8 border-b border-neutral-200 bg-gradient-to-r from-accent-50 to-white"
      >
        <h1 class="text-2xl font-bold text-neutral-900 mb-1">
          Course Enrollment
        </h1>
        <p class="text-sm text-neutral-600 mb-0">
          Review the course details before confirming your enrollment
        </p>
      </div>

      <div class="p-6 sm:p-8">
        <div class="mb-6">
          <div class="flex items-center mb-4">
            <div class="bg-accent-100 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-accent-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-neutral-900">
                {{ course.name }}
              </h2>
              <p class="text-sm text-accent-600 font-medium">
                {{ course.code }}
              </p>
            </div>
          </div>

          <div class="bg-neutral-50 p-4 rounded-lg mb-6">
            <p class="text-neutral-700">{{ course.description }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div
              class="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm"
            >
              <div class="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-accent-500 mr-2"
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
                <div class="text-sm font-medium text-neutral-700">
                  Start Date
                </div>
              </div>
              <div class="text-neutral-900 font-medium">
                {{ formatDate(course.startDate) }}
              </div>
            </div>

            <div
              class="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm"
            >
              <div class="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-accent-500 mr-2"
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
                <div class="text-sm font-medium text-neutral-700">End Date</div>
              </div>
              <div class="text-neutral-900 font-medium">
                {{ formatDate(course.endDate) }}
              </div>
            </div>
          </div>

          <div v-if="prerequisites.length > 0" class="mb-6">
            <h3 class="text-md font-semibold text-neutral-800 mb-2">
              Prerequisites
            </h3>
            <ul class="list-disc pl-5 space-y-1">
              <li
                v-for="(prereq, index) in prerequisites"
                :key="index"
                class="text-neutral-700"
              >
                {{ prereq }}
              </li>
            </ul>
          </div>
        </div>

        <div class="flex justify-end gap-x-3">
          <router-link to="/dashboard" class="btn btn-secondary">
            Cancel
          </router-link>
          <button
            @click="enrollInCourse"
            :disabled="enrolling"
            class="btn btn-primary"
          >
            <svg
              v-if="enrolling"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ enrolling ? "Enrolling..." : "Enroll Now" }}
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
  instructor?: string;
  credits?: number;
}

const route = useRoute();
const router = useRouter();
const courseId = computed(() => route.params.courseId as string);

const loading = ref(true);
const enrolling = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const loadingMessage = ref("Loading course information...");
const prerequisites = ref<string[]>([]);

const course = ref<Course>({
  id: "",
  name: "",
  code: "",
  description: "",
  startDate: "",
  endDate: "",
});

onMounted(async () => {
  await fetchCourseData();
});

async function fetchCourseData() {
  loading.value = true;
  loadingMessage.value = "Loading course information...";
  error.value = null;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock course data
    if (courseId.value) {
      course.value = {
        id: courseId.value,
        name: "Introduction to Computer Science",
        code: "CS101",
        description:
          "An introductory course to computer science principles covering fundamental concepts of programming, algorithms, data structures, and problem-solving techniques. This course is designed for students with little to no prior programming experience.",
        startDate: "2023-09-01",
        endDate: "2023-12-15",
        instructor: "Dr. Jane Smith",
        credits: 3,
      };

      // Mock prerequisites
      prerequisites.value = [
        "Basic computer literacy",
        "High school algebra or equivalent",
      ];

      loading.value = false;
    } else {
      error.value = "Invalid course ID. Please select a valid course.";
      loading.value = false;
    }
  } catch (err) {
    error.value = "Failed to load course information. Please try again later.";
    loading.value = false;
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function enrollInCourse() {
  enrolling.value = true;
  loadingMessage.value = "Processing your enrollment...";
  loading.value = true;

  try {
    // Simulate API call to enroll in course
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real implementation, you would make an API call to enroll the student
    success.value = true;
    loading.value = false;
    enrolling.value = false;
  } catch (err) {
    error.value = "Failed to complete enrollment. Please try again.";
    loading.value = false;
    enrolling.value = false;
  }
}

function retryOperation() {
  if (!success.value) {
    fetchCourseData();
  }
}
</script>

<style scoped>
.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

.btn {
  @reference inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @reference text-white bg-accent-600 hover:bg-accent-700 border-transparent focus:ring-accent-500;
}

.btn-secondary {
  @reference text-accent-700 bg-accent-100 hover:bg-accent-200 border-accent-200 focus:ring-accent-500;
}
</style>
