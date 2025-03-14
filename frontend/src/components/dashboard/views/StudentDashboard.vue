<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- My Projects -->
    <div class="md:col-span-2">
      <DashboardCard
        title="My Projects"
        subtitle="Your current and completed projects"
        :loading="loading"
        :isEmpty="projects.length === 0 && !useMockData"
        emptyMessage="You don't have any projects yet."
        emptyDescription="Start a new project to begin working on real-world problems."
      >
        <ProjectList
          :projects="projects"
          :showAgent="true"
          :useMockData="useMockData"
        />
      </DashboardCard>
    </div>

    <!-- Student Performance Report -->
    <div>
      <DashboardCard
        title="Performance Report"
        subtitle="Track your progress and get insights on your performance"
      >
        <div class="px-6 py-8 sm:px-8">
          <ReportDownloader entityType="student" :entityId="userId" />
        </div>
      </DashboardCard>
    </div>

    <!-- My Enrolled Courses -->
    <div class="md:col-span-3">
      <DashboardCard
        title="My Enrolled Courses"
        subtitle="Courses you are currently enrolled in"
        :loading="loadingCourses"
        :isEmpty="enrolledCourses.length === 0 && !useMockData"
        emptyMessage="You are not enrolled in any courses yet."
        emptyDescription="Contact your professor for enrollment information."
      >
        <template #actions>
          <router-link to="/courses" class="btn btn-secondary">
            View All Courses
          </router-link>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div
            v-for="course in displayCourses"
            :key="course.id"
            class="bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="p-4">
              <h3 class="text-lg font-semibold text-neutral-900 mb-2">
                {{ course.name }}
              </h3>
              <p class="text-neutral-600 text-sm mb-3 line-clamp-2">
                {{ course.description }}
              </p>
              <div class="flex justify-between items-center">
                <span class="text-xs text-neutral-500"
                  >Code: {{ course.code }}</span
                >
                <router-link
                  :to="`/courses/${course.id}`"
                  class="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, computed } from "vue";
import DashboardCard from "../../dashboard/cards/DashboardCard.vue";
import ProjectList from "../../dashboard/lists/ProjectList.vue";
import ReportDownloader from "../../ReportDownloader.vue";
import { useCourseStore } from "@/stores/course";
import type { Course } from "@/types";

interface Project {
  id: string;
  title: string;
  status: string;
  agent?: {
    name: string;
  };
  endDate: Date;
}

interface Props {
  projects: Project[];
  loading: boolean;
  userId: string;
  useMockData?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  useMockData: false,
});

const emit = defineEmits<{
  (e: "startNewProject"): void;
}>();

const courseStore = useCourseStore();
const loadingCourses = ref(true);
const enrolledCourses = ref<Course[]>([]);

// Mock courses data
const mockCourses = [
  {
    id: "course-1",
    name: "Web Development",
    code: "WEB101",
    description:
      "Learn modern web development techniques including HTML, CSS, JavaScript, and responsive design principles.",
  },
  {
    id: "course-2",
    name: "Artificial Intelligence",
    code: "AI202",
    description:
      "Introduction to AI concepts, machine learning algorithms, neural networks, and practical applications.",
  },
  {
    id: "course-3",
    name: "Mobile Applications",
    code: "MOB303",
    description:
      "Develop cross-platform mobile applications using modern frameworks and best practices.",
  },
  {
    id: "course-4",
    name: "Database Systems",
    code: "DB404",
    description:
      "Design and implement efficient database systems, learn SQL, NoSQL, and data modeling techniques.",
  },
  {
    id: "course-5",
    name: "Cybersecurity",
    code: "SEC505",
    description:
      "Understand security principles, threat modeling, encryption, and defensive programming techniques.",
  },
];

// Decide which courses to display
const displayCourses = computed(() => {
  if (
    props.useMockData ||
    (enrolledCourses.value.length === 0 && props.useMockData !== false)
  ) {
    return mockCourses;
  }
  return enrolledCourses.value;
});

onMounted(async () => {
  try {
    loadingCourses.value = true;
    await courseStore.fetchCourses();
    enrolledCourses.value = courseStore.enrolledCourses;
  } catch (error) {
    console.error("Error loading enrolled courses:", error);
  } finally {
    loadingCourses.value = false;
  }
});
</script>
