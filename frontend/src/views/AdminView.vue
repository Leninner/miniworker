<template>
  <div class="container mx-auto">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="spinner"></div>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold">Administration Dashboard</h1>

      <div class="mb-8">
        <div class="mb-6">
          <div class="tabs flex border-b border-neutral-200">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'nav-link py-3 px-6 font-medium -mb-px text-base',
                activeTab === tab.id
                  ? 'border-b-2 border-accent-500 text-accent-700'
                  : 'text-neutral-500 hover:text-accent-600',
              ]"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="admin-tab-content">
          <div
            class="flex flex-col md:flex-row justify-between mb-6 space-y-3 md:space-y-0"
          >
            <h2 class="text-xl font-semibold text-neutral-900">
              User Management
            </h2>
            <div class="flex items-center space-x-3">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search users..."
                class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button @click="resetSearch" class="btn btn-secondary">
                Reset
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="py-4 px-6 text-left">Name</th>
                  <th class="py-4 px-6 text-left">Email</th>
                  <th class="py-4 px-6 text-left">Role</th>
                  <th class="py-4 px-6 text-left">Status</th>
                  <th class="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200">
                <tr
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="border-b border-neutral-200"
                >
                  <td class="py-4 px-6">
                    {{ user.firstName }} {{ user.lastName }}
                  </td>
                  <td class="py-4 px-6">{{ user.email }}</td>
                  <td class="py-4 px-6">
                    <span :class="getRoleBadgeClass(user.role)">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <span :class="getStatusBadgeClass(user.status)">
                      {{ user.status || "Inactive" }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex space-x-3">
                      <button
                        @click="editUser(user)"
                        class="btn btn-secondary py-1.5 px-3 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        v-if="user.status === 'active'"
                        @click="toggleUserStatus(user)"
                        class="btn btn-danger py-1.5 px-3 text-sm"
                      >
                        Deactivate
                      </button>
                      <button
                        v-else
                        @click="toggleUserStatus(user)"
                        class="btn btn-success py-1.5 px-3 text-sm"
                      >
                        Activate
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            class="mt-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0"
          >
            <div class="text-sm text-neutral-500">
              Showing {{ paginatedUsers.length }} of {{ users.length }} users
            </div>
            <div class="flex space-x-3">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                :class="[
                  'btn',
                  currentPage === 1
                    ? 'btn-secondary opacity-50 cursor-not-allowed'
                    : 'btn-secondary',
                ]"
              >
                Previous
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage >= totalPages"
                :class="[
                  'btn',
                  currentPage >= totalPages
                    ? 'btn-secondary opacity-50 cursor-not-allowed'
                    : 'btn-secondary',
                ]"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- Projects Tab -->
        <div v-if="activeTab === 'projects'" class="admin-tab-content">
          <div
            class="flex flex-col md:flex-row justify-between mb-6 space-y-3 md:space-y-0"
          >
            <h2 class="text-xl font-semibold text-neutral-900">
              Project Management
            </h2>
            <div
              class="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3"
            >
              <input
                type="text"
                v-model="projectSearchQuery"
                placeholder="Search projects..."
                class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <select
                v-model="projectFilter"
                class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="py-4 px-6 text-left">Title</th>
                  <th class="py-4 px-6 text-left">Created By</th>
                  <th class="py-4 px-6 text-left">Group</th>
                  <th class="py-4 px-6 text-left">Status</th>
                  <th class="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200">
                <tr
                  v-for="project in filteredProjects"
                  :key="project.id"
                  class="table-row"
                >
                  <td class="py-4 px-6 font-medium">{{ project.title }}</td>
                  <td class="py-4 px-6">{{ project.createdBy }}</td>
                  <td class="py-4 px-6">{{ project.group || "No Group" }}</td>
                  <td class="py-4 px-6">
                    <span :class="getProjectStatusBadgeClass(project.status)">
                      {{ project.status }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex space-x-3">
                      <button
                        @click="viewProject(project)"
                        class="btn btn-primary py-1.5 px-3 text-sm"
                      >
                        View
                      </button>
                      <button
                        @click="archiveProject(project)"
                        class="btn btn-secondary py-1.5 px-3 text-sm"
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Groups Tab -->
        <div v-if="activeTab === 'groups'" class="admin-tab-content">
          <div
            class="flex flex-col md:flex-row justify-between mb-6 space-y-3 md:space-y-0"
          >
            <h2 class="text-xl font-semibold text-neutral-900">
              Group Management
            </h2>
            <button @click="createGroup" class="btn btn-primary">
              Create New Group
            </button>
          </div>

          <div class="card-grid">
            <div
              v-for="group in groups"
              :key="group.id"
              class="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <!-- Group Header -->
              <div class="px-6 py-5 border-b border-neutral-200 bg-neutral-50">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold text-neutral-900 mb-0">
                    {{ group.name }}
                  </h3>
                  <span :class="getGroupStatusBadgeClass(group.status)">
                    {{ group.status }}
                  </span>
                </div>
              </div>

              <!-- Group Content -->
              <div class="p-6">
                <p class="text-neutral-600 mb-5">{{ group.description }}</p>
                <div
                  class="bg-neutral-50 rounded-lg p-4 mb-5 divide-y divide-neutral-200"
                >
                  <div class="flex justify-between items-center py-2">
                    <span class="text-neutral-700 font-medium">Members</span>
                    <span class="text-accent-600 font-semibold">{{
                      group.members.length
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-neutral-700 font-medium">Projects</span>
                    <span class="text-accent-600 font-semibold">{{
                      group.projects.length
                    }}</span>
                  </div>
                </div>
                <div class="flex space-x-3">
                  <button
                    @click="viewGroup(group)"
                    class="btn btn-primary py-2 px-4 text-sm flex-1"
                  >
                    View Details
                  </button>
                  <button
                    @click="editGroup(group)"
                    class="btn btn-secondary py-2 px-4 text-sm flex-1"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Agents Tab -->
        <div v-if="activeTab === 'agents'" class="admin-tab-content">
          <div
            class="flex flex-col md:flex-row justify-between mb-6 space-y-3 md:space-y-0"
          >
            <h2 class="text-xl font-semibold text-neutral-900">
              AI Agent Management
            </h2>
            <button @click="createAgent" class="btn btn-primary">
              Create New Agent
            </button>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="py-4 px-6 text-left">Name</th>
                  <th class="py-4 px-6 text-left">Type</th>
                  <th class="py-4 px-6 text-left">Model</th>
                  <th class="py-4 px-6 text-left">Status</th>
                  <th class="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200">
                <tr v-for="agent in agents" :key="agent.id" class="table-row">
                  <td class="py-4 px-6 font-medium">{{ agent.name }}</td>
                  <td class="py-4 px-6">{{ agent.type }}</td>
                  <td class="py-4 px-6">{{ agent.model }}</td>
                  <td class="py-4 px-6">
                    <span :class="getAgentStatusBadgeClass(agent.status)">
                      {{ agent.status }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex space-x-3">
                      <button
                        @click="editAgentConfig(agent)"
                        class="btn btn-primary py-1.5 px-3 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        @click="toggleAgentStatus(agent)"
                        :class="[
                          'btn py-1.5 px-3 text-sm',
                          agent.status === 'active'
                            ? 'btn-danger'
                            : 'btn-success',
                        ]"
                      >
                        {{ agent.status === "active" ? "Disable" : "Enable" }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal for user editing -->
      <div v-if="showUserModal" class="modal-backdrop">
        <div class="modal-content max-w-lg">
          <div class="modal-header">
            <h2 class="text-xl font-bold">Edit User</h2>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-5">
                <label class="form-label">First Name</label>
                <input
                  type="text"
                  v-model="editingUser.firstName"
                  class="form-input"
                  required
                />
              </div>
              <div class="mb-5">
                <label class="form-label">Last Name</label>
                <input
                  type="text"
                  v-model="editingUser.lastName"
                  class="form-input"
                  required
                />
              </div>
              <div class="mb-5">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  v-model="editingUser.email"
                  class="form-input"
                  required
                />
              </div>
              <div class="mb-5">
                <label class="form-label">Role</label>
                <select v-model="editingUser.role" class="form-input">
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  @click="showUserModal = false"
                  class="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiService from "@/services/api";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.isAdmin) {
  router.push("/dashboard");
}

const loading = ref(true);
const tabs = [
  { id: "users", name: "Users" },
  { id: "projects", name: "Projects" },
  { id: "groups", name: "Groups" },
  { id: "agents", name: "AI Agents" },
];
const activeTab = ref("users");
const users = ref([]);
const projects = ref([]);
const groups = ref([]);
const agents = ref([]);

// Pagination and filtering
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const projectSearchQuery = ref("");
const projectFilter = ref("all");

// User editing
const showUserModal = ref(false);
const editingUser = ref({});

// Computed properties
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  const query = searchQuery.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const filteredProjects = computed(() => {
  let result = projects.value;

  // Apply search filter
  if (projectSearchQuery.value) {
    const query = projectSearchQuery.value.toLowerCase();
    result = result.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.createdBy.toLowerCase().includes(query) ||
        (project.group && project.group.toLowerCase().includes(query))
    );
  }

  // Apply status filter
  if (projectFilter.value !== "all") {
    result = result.filter((project) => project.status === projectFilter.value);
  }

  return result;
});

// Lifecycle hooks
onMounted(async () => {
  try {
    await Promise.all([
      fetchUsers(),
      fetchProjects(),
      fetchGroups(),
      fetchAgents(),
    ]);
  } catch (error) {
    console.error("Failed to load admin data:", error);
  } finally {
    loading.value = false;
  }
});

// Methods
const fetchUsers = async () => {
  try {
    const response = await apiService.userService.getUsers();
    users.value = response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

const fetchProjects = async () => {
  try {
    const response = await apiService.projectService.getProjects();
    projects.value = response.data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }
};

const fetchGroups = async () => {
  try {
    const response = await apiService.projectGroupService.getAllProjectGroups();
    groups.value = response.data;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
  }
};

const fetchAgents = async () => {
  try {
    const response = await apiService.agentService.getAgents();
    agents.value = response.data;
  } catch (error) {
    console.error("Failed to fetch agents:", error);
  }
};

const resetSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
};

// User actions
const editUser = (user) => {
  editingUser.value = { ...user };
  showUserModal.value = true;
};

const saveUser = async () => {
  try {
    await apiService.updateUser(editingUser.value.id, editingUser.value);
    // Update the user in the list
    const index = users.value.findIndex((u) => u.id === editingUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...editingUser.value };
    }
    showUserModal.value = false;
  } catch (error) {
    console.error("Failed to update user:", error);
  }
};

const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === "active" ? "inactive" : "active";
    await apiService.updateUserStatus(user.id, { status: newStatus });
    // Update the user status in the list
    const index = users.value.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users.value[index].status = newStatus;
    }
  } catch (error) {
    console.error("Failed to update user status:", error);
  }
};

// Project actions
const viewProject = (project) => {
  router.push(`/projects/${project.id}`);
};

const archiveProject = async (project) => {
  try {
    await apiService.projectService.updateProjectStatus(project.id, {
      status: "archived",
    });
    // Update the project status in the list
    const index = projects.value.findIndex((p) => p.id === project.id);
    if (index !== -1) {
      projects.value[index].status = "archived";
    }
  } catch (error) {
    console.error("Failed to archive project:", error);
  }
};

// Group actions
const viewGroup = (group) => {
  router.push(`/project-groups/${group.id}`);
};

const editGroup = (group) => {
  router.push(`/project-groups/${group.id}/edit`);
};

const createGroup = () => {
  router.push("/project-groups/create");
};

// Agent actions
const editAgentConfig = (agent) => {
  router.push(`/agents/${agent.id}/edit`);
};

const createAgent = () => {
  router.push("/agents/create");
};

const toggleAgentStatus = async (agent) => {
  try {
    const newStatus = agent.status === "active" ? "disabled" : "active";
    await apiService.agentService.updateAgentStatus(agent.id, {
      status: newStatus,
    });
    // Update the agent status in the list
    const index = agents.value.findIndex((a) => a.id === agent.id);
    if (index !== -1) {
      agents.value[index].status = newStatus;
    }
  } catch (error) {
    console.error("Failed to update agent status:", error);
  }
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case "admin":
      return "rounded-full px-2 py-1 text-sm bg-slate-500 text-white";
    case "professor":
      return "rounded-full px-2 py-1 text-sm bg-blue-500 text-white";
    case "student":
      return "rounded-full px-2 py-1 text-sm bg-green-500 text-white";
    default:
      return "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white";
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "active":
      return "rounded-full px-2 py-1 text-sm bg-green-500 text-white";
    case "inactive":
      return "rounded-full px-2 py-1 text-sm bg-red-500 text-white";
    default:
      return "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white";
  }
};

const getProjectStatusBadgeClass = (status) => {
  switch (status) {
    case "active":
      return "rounded-full px-2 py-1 text-sm status-active";
    case "completed":
      return "rounded-full px-2 py-1 text-sm status-completed";
    case "archived":
      return "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white";
    default:
      return "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white";
  }
};

const getGroupStatusBadgeClass = (status) => {
  switch (status) {
    case "active":
      return "rounded-full px-2 py-1 text-sm status-active";
    case "archived":
      return "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white";
    default:
      return "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white";
  }
};

const getAgentStatusBadgeClass = (status) => {
  switch (status) {
    case "active":
      return "rounded-full px-2 py-1 text-sm bg-green-500 text-white";
    case "disabled":
      return "rounded-full px-2 py-1 text-sm bg-red-500 text-white";
    case "pending":
      return "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white";
    default:
      return "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white";
  }
};
</script>

<style scoped>
.admin-tab-content {
  min-height: 400px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
