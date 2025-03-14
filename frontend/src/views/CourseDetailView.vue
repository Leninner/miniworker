<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ error }}
    </div>

    <div v-else>
      <!-- Back button -->
      <div class="mb-6">
        <router-link
          to="/courses"
          class="text-primary hover:text-primary-dark flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Courses
        </router-link>
      </div>

      <!-- Course Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">
          {{ displayCourse?.name }}
        </h1>
        <p class="text-neutral-600 mb-4">{{ displayCourse?.description }}</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="bg-neutral-50 p-3 rounded">
            <span class="text-neutral-500">Course Code:</span>
            <span class="font-medium ml-2">{{ displayCourse?.code }}</span>
          </div>
          <div class="bg-neutral-50 p-3 rounded">
            <span class="text-neutral-500">Start Date:</span>
            <span class="font-medium ml-2">{{
              formatDate(displayCourse?.startDate)
            }}</span>
          </div>
          <div class="bg-neutral-50 p-3 rounded">
            <span class="text-neutral-500">End Date:</span>
            <span class="font-medium ml-2">{{
              formatDate(displayCourse?.endDate)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Student View -->
      <div v-if="authStore.isStudent">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">
          My Projects in this Course
        </h2>

        <div
          v-if="courseProjects.length === 0 && !useMockData"
          class="bg-neutral-50 rounded-lg p-6 text-center"
        >
          <p class="text-neutral-600 mb-2">
            You don't have any projects in this course yet.
          </p>
          <p class="text-neutral-500 text-sm">
            Start a new project or join a project group.
          </p>

          <div class="mt-4">
            <router-link to="/projects/create" class="btn btn-primary">
              Start New Project
            </router-link>
          </div>
        </div>

        <div v-else>
          <ProjectList
            :projects="courseProjects"
            :showAgent="true"
            :useMockData="useMockData"
            :courseId="courseId"
          />
        </div>
      </div>

      <!-- Professor/Admin View -->
      <div v-else>
        <CourseDetail />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCourseStore } from "@/stores/course";
import CourseDetail from "@/components/dashboard/views/CourseDetail.vue";
import ProjectList from "@/components/dashboard/lists/ProjectList.vue";
import apiService from "@/services/api";
import type { Project } from "@/types";

const route = useRoute();
const authStore = useAuthStore();
const courseStore = useCourseStore();

const loading = ref(true);
const error = ref<string | null>(null);
const courseProjects = ref<Project[]>([]);
const useMockData = ref(true); // Set to true to use mock data

const courseId = computed(() => route.params.id as string);
const course = computed(() => courseStore.selectedCourse);

// Mock course data
const mockCourses = [
  {
    id: "course-1",
    name: "Web Development",
    code: "WEB101",
    description:
      "Learn modern web development techniques including HTML, CSS, JavaScript, and responsive design principles.",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
  },
  {
    id: "course-2",
    name: "Artificial Intelligence",
    code: "AI202",
    description:
      "Introduction to AI concepts, machine learning algorithms, neural networks, and practical applications.",
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 days from now
  },
  {
    id: "course-3",
    name: "Mobile Applications",
    code: "MOB303",
    description:
      "Develop cross-platform mobile applications using modern frameworks and best practices.",
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
  },
  {
    id: "course-4",
    name: "Database Systems",
    code: "DB404",
    description:
      "Design and implement efficient database systems, learn SQL, NoSQL, and data modeling techniques.",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    id: "course-5",
    name: "Cybersecurity",
    code: "SEC505",
    description:
      "Understand security principles, threat modeling, encryption, and defensive programming techniques.",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000), // 80 days from now
  },
];

// Find the mock course that matches the courseId
const mockCourse = computed(() => {
  return mockCourses.find((c) => c.id === courseId.value) || null;
});

// Decide which course to display
const displayCourse = computed(() => {
  if (useMockData.value || !course.value) {
    return mockCourse.value;
  }
  return course.value;
});

onMounted(async () => {
  try {
    loading.value = true;

    // Fetch course details if not using mock data
    if (!useMockData.value) {
      await courseStore.fetchCourse(courseId.value);

      // If student, fetch projects for this course
      if (authStore.isStudent && authStore.user?.id) {
        const response = await apiService.projectService.getProjects({
          userId: authStore.user.id,
          courseId: courseId.value,
        });
        courseProjects.value = response.data;
      }
    } else {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (err: any) {
    error.value = err.message || "Failed to load course details";
  } finally {
    loading.value = false;
  }
});

// Helper functions
function formatDate(date: Date | undefined): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    in_progress: "In Progress",
    completed: "Completed",
    pending: "Pending",
  };
  return statusMap[status] || status;
}
</script>
