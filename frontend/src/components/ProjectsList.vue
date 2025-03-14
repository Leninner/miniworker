<template>
  <div>
    <!-- Filters and sorting -->
    <div class="mb-6 bg-white p-4 shadow rounded-lg">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
        >
          <div class="flex items-center">
            <label
              for="status-filter"
              class="mr-2 text-sm font-medium text-gray-700"
              >Status:</label
            >
            <select
              id="status-filter"
              v-model="filters.status"
              class="form-select text-sm"
              @change="filterProjects"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>

          <div v-if="showAgentFilter" class="flex items-center">
            <label
              for="agent-filter"
              class="mr-2 text-sm font-medium text-gray-700"
              >Agent:</label
            >
            <select
              id="agent-filter"
              v-model="filters.agentCategory"
              class="form-select text-sm"
              @change="filterProjects"
            >
              <option value="all">All Categories</option>
              <option value="automation">Automation</option>
              <option value="web_dev">Web Development</option>
              <option value="data_analytics">Data Analytics</option>
              <option value="mobile_dev">Mobile Dev</option>
              <option value="cybersecurity">Cybersecurity</option>
            </select>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <label for="sort-by" class="text-sm font-medium text-gray-700"
            >Sort by:</label
          >
          <select
            id="sort-by"
            v-model="sortBy"
            class="form-select text-sm"
            @change="sortProjects"
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
          </select>
        </div>
      </div>

      <div class="mt-3">
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search projects..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md form-input w-full md:w-64"
            @input="filterProjects"
          />
        </div>
      </div>
    </div>

    <!-- Project list -->
    <div v-if="isLoading" class="flex justify-center my-12">
      <svg
        class="animate-spin h-10 w-10 text-blue-600"
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
    </div>

    <div
      v-else-if="filteredProjects.length === 0"
      class="bg-white shadow rounded-lg p-6 text-center"
    >
      <svg
        class="h-12 w-12 text-gray-400 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria.
      </p>
      <div class="mt-6">
        <button
          v-if="userCanCreateProject"
          type="button"
          class="btn btn-primary"
          @click="$emit('create-project')"
        >
          Create new project
        </button>
      </div>
    </div>

    <div v-else class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="p-5">
          <div class="flex justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 truncate">
                {{ project.title }}
              </h3>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1"
                :class="{
                  'bg-yellow-100 text-yellow-800': project.status === 'pending',
                  'bg-blue-100 text-blue-800': project.status === 'in_progress',
                  'bg-green-100 text-green-800': project.status === 'completed',
                  'bg-purple-100 text-purple-800':
                    project.status === 'submitted',
                  'bg-gray-100 text-gray-800': project.status === 'graded',
                }"
              >
                {{ formatStatus(project.status) }}
              </span>
            </div>
            <div v-if="project.grade" class="flex items-center">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                Grade: {{ project.grade }}/10
              </span>
            </div>
          </div>

          <div class="mt-2 text-sm text-gray-600 line-clamp-2">
            {{ project.description || project.problemStatement }}
          </div>

          <div class="mt-4">
            <div class="flex items-center text-sm text-gray-500">
              <svg
                class="mr-1.5 h-5 w-5 text-gray-400"
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
              <span>{{ formatDate(project.createdAt) }}</span>
            </div>

            <div
              v-if="project.agent"
              class="flex items-center mt-1 text-sm text-gray-500"
            >
              <svg
                class="mr-1.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span>{{ project.agent.name }}</span>
            </div>

            <div
              v-if="project.student && userRole === 'professor'"
              class="flex items-center mt-1 text-sm text-gray-500"
            >
              <svg
                class="mr-1.5 h-5 w-5 text-gray-400"
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
              <span>{{ project.student.name }}</span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-5">
          <div class="flex justify-between items-center">
            <div v-if="project.progress" class="flex items-center">
              <div
                class="relative w-full bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]"
              >
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: `${project.progress}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500">{{ project.progress }}%</span>
            </div>

            <div>
              <router-link
                :to="`/projects/${project.id}`"
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination (simplified version) -->
    <div v-if="filteredProjects.length > 0" class="mt-6 flex justify-center">
      <nav class="inline-flex rounded-md shadow">
        <button
          :disabled="currentPage <= 1"
          @click="changePage(currentPage - 1)"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
        >
          <span class="sr-only">Previous</span>
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <span
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
        >
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage >= totalPages,
          }"
        >
          <span class="sr-only">Next</span>
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, defineProps, defineEmits } from "vue";

const props = defineProps({
  projects: {
    type: Array as () => any[],
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  userRole: {
    type: String,
    default: "student",
  },
  showAgentFilter: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:projects", "refresh", "create-project"]);

// Pagination
const itemsPerPage = 9;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(filteredProjects.value.length / itemsPerPage)
);

// Filters and sorting
const searchTerm = ref("");
const sortBy = ref("date_desc");
const filters = ref({
  status: "all",
  agentCategory: "all",
});

// Computed properties
const userCanCreateProject = computed(() => props.userRole === "student");

const filteredProjects = computed(() => {
  let result = [...props.projects];

  // Apply search filter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(
      (project) =>
        project.title.toLowerCase().includes(term) ||
        (project.description &&
          project.description.toLowerCase().includes(term)) ||
        (project.problemStatement &&
          project.problemStatement.toLowerCase().includes(term))
    );
  }

  // Apply status filter
  if (filters.value.status !== "all") {
    result = result.filter(
      (project) => project.status === filters.value.status
    );
  }

  // Apply agent category filter
  if (filters.value.agentCategory !== "all" && props.showAgentFilter) {
    result = result.filter(
      (project) =>
        project.agent &&
        project.agent.problemCategory === filters.value.agentCategory
    );
  }

  // Apply sorting
  result = sortProjects(result);

  return result;
});

const paginatedProjects = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredProjects.value.slice(startIndex, startIndex + itemsPerPage);
});

// Methods
function filterProjects() {
  // Reset to first page when filters change
  currentPage.value = 1;
}

function sortProjects(projects = filteredProjects.value) {
  let sorted = [...projects];

  switch (sortBy.value) {
    case "date_desc":
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "date_asc":
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "title_asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title_desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return sorted;
}

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function formatDate(dateString: string | Date) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatStatus(status: string) {
  if (!status) return "Unknown";

  const statusMap: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    submitted: "Submitted",
    graded: "Graded",
  };

  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

// When projects prop changes, reset to page 1
watch(
  () => props.projects,
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

onMounted(() => {
  // Initial sort
  sortProjects();
});
</script>
