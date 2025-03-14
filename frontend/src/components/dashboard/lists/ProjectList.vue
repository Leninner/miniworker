<template>
  <ul role="list" class="divide-y divide-neutral-200">
    <li
      v-for="project in displayProjects"
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
              <p
                v-if="showCourse && project.course"
                class="flex items-center text-sm text-neutral-600 mb-0 ml-4"
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span class="font-medium">Course:</span>
                {{ project.course?.name || "Unknown" }}
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
import { defineProps, computed } from "vue";
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
  course?: {
    id: string;
    name: string;
    code: string;
  };
  endDate: Date;
  createdBy?: string;
  group?: string;
}

interface Props {
  projects: Project[];
  showAgent?: boolean;
  showStudent?: boolean;
  showCourse?: boolean;
  useMockData?: boolean;
  courseId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showAgent: false,
  showStudent: false,
  showCourse: false,
  useMockData: false,
  courseId: "",
});

// Mock projects data
const mockProjects: Project[] = [
  {
    id: "mock-1",
    title: "E-commerce Platform Development",
    status: "in_progress",
    agent: { name: "Web Development Agent" },
    course: { id: "course-1", name: "Web Development", code: "WEB101" },
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
  },
  {
    id: "mock-2",
    title: "Machine Learning Image Recognition",
    status: "pending",
    agent: { name: "AI Research Agent" },
    course: { id: "course-2", name: "Artificial Intelligence", code: "AI202" },
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  },
  {
    id: "mock-3",
    title: "Mobile App for Health Tracking",
    status: "completed",
    agent: { name: "Mobile Development Agent" },
    course: { id: "course-3", name: "Mobile Applications", code: "MOB303" },
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: "mock-4",
    title: "Database Optimization Project",
    status: "in_progress",
    agent: { name: "Database Systems Agent" },
    course: { id: "course-4", name: "Database Systems", code: "DB404" },
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    id: "mock-5",
    title: "Cybersecurity Vulnerability Assessment",
    status: "in_progress",
    agent: { name: "Security Agent" },
    course: { id: "course-5", name: "Cybersecurity", code: "SEC505" },
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
  },
];

// Filter mock projects by course if courseId is provided
const filteredMockProjects = computed(() => {
  if (props.courseId) {
    return mockProjects.filter(
      (project) => project.course?.id === props.courseId
    );
  }
  return mockProjects;
});

// Decide which projects to display
const displayProjects = computed(() => {
  if (
    props.useMockData ||
    (props.projects.length === 0 && props.useMockData !== false)
  ) {
    return filteredMockProjects.value;
  }
  return props.projects;
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
