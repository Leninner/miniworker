<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-900 mb-8">Courses</h1>

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
      <!-- Student View - Enrolled Courses -->
      <div v-if="authStore.isStudent">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">
          My Enrolled Courses
        </h2>

        <div
          v-if="enrolledCourses.length === 0 && !useMockData"
          class="bg-neutral-50 rounded-lg p-6 text-center"
        >
          <p class="text-neutral-600 mb-2">
            You are not enrolled in any courses yet.
          </p>
          <p class="text-neutral-500 text-sm">
            Contact your professor for enrollment information.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="course in displayCourses"
            :key="course.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div class="p-6">
              <h3 class="text-lg font-semibold text-neutral-900 mb-2">
                {{ course.name }}
              </h3>
              <p class="text-neutral-600 text-sm mb-4 line-clamp-2">
                {{ course.description }}
              </p>
              <div
                class="flex justify-between items-center text-sm text-neutral-500"
              >
                <span>Code: {{ course.code }}</span>
                <router-link
                  :to="`/courses/${course.id}`"
                  class="text-primary hover:text-primary-dark font-medium"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Professor/Admin View - All Courses -->
      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-neutral-800">All Courses</h2>
          <router-link to="/dashboard" class="btn btn-primary">
            Manage Courses
          </router-link>
        </div>

        <div
          v-if="courses.length === 0 && !useMockData"
          class="bg-neutral-50 rounded-lg p-6 text-center"
        >
          <p class="text-neutral-600 mb-2">No courses available.</p>
          <p class="text-neutral-500 text-sm">
            Create a new course from the dashboard.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="course in displayAllCourses"
            :key="course.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div class="p-6">
              <h3 class="text-lg font-semibold text-neutral-900 mb-2">
                {{ course.name }}
              </h3>
              <p class="text-neutral-600 text-sm mb-4 line-clamp-2">
                {{ course.description }}
              </p>
              <div
                class="flex justify-between items-center text-sm text-neutral-500"
              >
                <span>Code: {{ course.code }}</span>
                <router-link
                  :to="`/courses/${course.id}`"
                  class="text-primary hover:text-primary-dark font-medium"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCourseStore } from "@/stores/course";

const authStore = useAuthStore();
const courseStore = useCourseStore();

const loading = ref(true);
const error = ref<string | null>(null);
const useMockData = ref(true); // Set to true to use mock data

// Computed properties
const courses = computed(() => courseStore.courses);
const enrolledCourses = computed(() => courseStore.enrolledCourses);

// Mock courses data
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

// Decide which courses to display for students
const displayCourses = computed(() => {
  if (useMockData.value || enrolledCourses.value.length === 0) {
    return mockCourses;
  }
  return enrolledCourses.value;
});

// Decide which courses to display for professors/admins
const displayAllCourses = computed(() => {
  if (useMockData.value || courses.value.length === 0) {
    return mockCourses;
  }
  return courses.value;
});

onMounted(async () => {
  try {
    loading.value = true;
    if (!useMockData.value) {
      await courseStore.fetchCourses();
    } else {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (err: any) {
    error.value = err.message || "Failed to load courses";
  } finally {
    loading.value = false;
  }
});
</script>
