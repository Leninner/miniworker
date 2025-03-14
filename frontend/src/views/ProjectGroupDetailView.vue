<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center my-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div v-else>
      <!-- Back Button -->
      <div class="mb-6">
        <router-link
          to="/project-groups"
          class="flex items-center text-blue-600 hover:text-blue-800"
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
          Back to Groups
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Group Header -->
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ group.name }}</h1>
            <p class="text-gray-600 mt-1">{{ group.description }}</p>
          </div>

          <div v-if="canManageGroup" class="mt-4 md:mt-0 flex">
            <button
              @click="showEditModal = true"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md mr-2 hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit Group
            </button>
            <button
              @click="confirmDeleteGroup"
              class="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Group
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'members'"
              :class="[
                'pb-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              Members
            </button>
            <button
              @click="activeTab = 'projects'"
              :class="[
                'pb-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              Projects
            </button>
          </nav>
        </div>

        <!-- Members Tab -->
        <div v-if="activeTab === 'members'">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Group Members</h2>
            <button
              v-if="canManageGroup"
              @click="showAddMemberModal = true"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Member
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    v-if="canManageGroup"
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="member in members"
                  :key="member.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ member.firstName }} {{ member.lastName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ member.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ member.role }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      Active
                    </span>
                  </td>
                  <td
                    v-if="canManageGroup"
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <button
                      @click="confirmRemoveMember(member)"
                      class="text-red-600 hover:text-red-900"
                      :disabled="member.id === user.id"
                      :class="{
                        'opacity-50 cursor-not-allowed': member.id === user.id,
                      }"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
                <tr v-if="members.length === 0">
                  <td
                    colspan="5"
                    class="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No members found in this group.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Projects Tab -->
        <div v-if="activeTab === 'projects'">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">
              Assigned Projects
            </h2>
            <button
              v-if="canManageGroup"
              @click="showAssignProjectModal = true"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Assign Project
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="project in projects"
              :key="project.id"
              class="bg-gray-50 p-4 rounded-md shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold text-lg text-gray-800">
                    {{ project.title }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ project.description.substring(0, 100)
                    }}{{ project.description.length > 100 ? "..." : "" }}
                  </p>
                </div>
              </div>

              <div class="mt-4">
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Status:</span> {{ project.status }}
                </p>
                <p class="text-sm text-gray-700 mt-1">
                  <span class="font-medium">Due:</span>
                  {{ formatDate(project.dueDate) }}
                </p>
              </div>

              <div class="mt-4 flex justify-end">
                <router-link
                  :to="`/projects/${project.id}`"
                  class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  View Details
                </router-link>
              </div>
            </div>

            <div
              v-if="projects.length === 0"
              class="col-span-full text-center p-8 text-gray-500"
            >
              No projects have been assigned to this group yet.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Group Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Edit Group</h2>

        <form @submit.prevent="updateGroup">
          <div class="mb-4">
            <label
              for="groupName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Group Name</label
            >
            <input
              id="groupName"
              v-model="editForm.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="mb-4">
            <label
              for="groupDescription"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <textarea
              id="groupDescription"
              v-model="editForm.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              :disabled="saving"
            >
              {{ saving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div
      v-if="showAddMemberModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Add Member</h2>

        <div class="mb-4">
          <label
            for="userSearch"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Search User</label
          >
          <input
            id="userSearch"
            v-model="userSearchQuery"
            type="text"
            placeholder="Search by name or email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="searchUsers"
          />
        </div>

        <div
          v-if="searchResults.length > 0"
          class="mb-4 max-h-60 overflow-y-auto border rounded-md"
        >
          <div
            v-for="user in searchResults"
            :key="user.id"
            class="p-3 border-b hover:bg-gray-50 cursor-pointer"
            @click="selectUser(user)"
          >
            <div class="font-medium">
              {{ user.firstName }} {{ user.lastName }}
            </div>
            <div class="text-sm text-gray-600">{{ user.email }}</div>
          </div>
        </div>

        <div v-if="selectedUser" class="mb-4 p-3 border rounded-md bg-blue-50">
          <div class="font-medium">
            {{ selectedUser.firstName }} {{ selectedUser.lastName }}
          </div>
          <div class="text-sm text-gray-600">{{ selectedUser.email }}</div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="cancelAddMember"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="addMember"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            :disabled="!selectedUser || adding"
          >
            {{ adding ? "Adding..." : "Add Member" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Assign Project Modal -->
    <div
      v-if="showAssignProjectModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Assign Project</h2>

        <div class="mb-4">
          <label
            for="projectSearch"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Search Project</label
          >
          <input
            id="projectSearch"
            v-model="projectSearchQuery"
            type="text"
            placeholder="Search by title"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="searchProjects"
          />
        </div>

        <div
          v-if="projectSearchResults.length > 0"
          class="mb-4 max-h-60 overflow-y-auto border rounded-md"
        >
          <div
            v-for="project in projectSearchResults"
            :key="project.id"
            class="p-3 border-b hover:bg-gray-50 cursor-pointer"
            @click="selectProject(project)"
          >
            <div class="font-medium">{{ project.title }}</div>
            <div class="text-sm text-gray-600">
              {{ project.description.substring(0, 100)
              }}{{ project.description.length > 100 ? "..." : "" }}
            </div>
          </div>
        </div>

        <div
          v-if="selectedProject"
          class="mb-4 p-3 border rounded-md bg-blue-50"
        >
          <div class="font-medium">{{ selectedProject.title }}</div>
          <div class="text-sm text-gray-600">
            {{ selectedProject.description.substring(0, 100)
            }}{{ selectedProject.description.length > 100 ? "..." : "" }}
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="cancelAssignProject"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="assignProject"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            :disabled="!selectedProject || assigning"
          >
            {{ assigning ? "Assigning..." : "Assign Project" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-bold mb-4 text-gray-800">
          {{ confirmModal.title }}
        </h2>
        <p class="mb-6 text-gray-600">{{ confirmModal.message }}</p>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="showConfirmModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmModal.action"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Message -->
    <div
      v-if="alert.show"
      :class="[
        'fixed top-4 right-4 p-4 rounded-md shadow-lg max-w-md transition-all duration-300',
        alert.type === 'success'
          ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
          : 'bg-red-100 border-l-4 border-red-500 text-red-700',
      ]"
    >
      <div class="flex items-center">
        <span v-if="alert.type === 'success'" class="mr-2">✓</span>
        <span v-else class="mr-2">✗</span>
        <p>{{ alert.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiService from "@/services/api";

export default {
  name: "ProjectGroupDetailView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    // States
    const loading = ref(true);
    const saving = ref(false);
    const adding = ref(false);
    const assigning = ref(false);
    const group = ref({});
    const members = ref([]);
    const projects = ref([]);
    const activeTab = ref("members");

    // Modal states
    const showEditModal = ref(false);
    const showAddMemberModal = ref(false);
    const showAssignProjectModal = ref(false);
    const showConfirmModal = ref(false);
    const confirmModal = reactive({
      title: "",
      message: "",
      action: () => {},
    });

    // Form states
    const editForm = reactive({
      name: "",
      description: "",
    });

    // Search states
    const userSearchQuery = ref("");
    const searchResults = ref([]);
    const selectedUser = ref(null);

    const projectSearchQuery = ref("");
    const projectSearchResults = ref([]);
    const selectedProject = ref(null);

    // Alert state
    const alert = reactive({
      show: false,
      type: "success",
      message: "",
    });

    // Computed properties
    const canManageGroup = computed(() => {
      return authStore.isAdmin || authStore.isProfessor;
    });

    // Methods
    const showAlert = (type, message) => {
      alert.show = true;
      alert.type = type;
      alert.message = message;

      setTimeout(() => {
        alert.show = false;
      }, 3000);
    };

    const loadGroup = async () => {
      try {
        loading.value = true;
        const response = await apiService.projectGroupService.getGroup(
          route.params.id
        );
        group.value = response.data;

        // Load members and projects
        await Promise.all([loadMembers(), loadProjects()]);
      } catch (error) {
        console.error("Error loading group:", error);
        showAlert("error", "Failed to load group details");
        router.push("/project-groups");
      } finally {
        loading.value = false;
      }
    };

    const loadMembers = async () => {
      try {
        // This is a hypothetical endpoint, adjust according to your API
        const response = await apiService.projectGroupService.getGroup(
          route.params.id
        );
        members.value = response.data.members || [];
      } catch (error) {
        console.error("Error loading members:", error);
        showAlert("error", "Failed to load group members");
      }
    };

    const loadProjects = async () => {
      try {
        // This is a hypothetical endpoint, adjust according to your API
        const response = await apiService.projectGroupService.getGroup(
          route.params.id
        );
        projects.value = response.data.projects || [];
      } catch (error) {
        console.error("Error loading projects:", error);
        showAlert("error", "Failed to load group projects");
      }
    };

    const updateGroup = async () => {
      try {
        saving.value = true;

        await apiService.projectGroupService.updateGroup(group.value.id, {
          name: editForm.name,
          description: editForm.description,
        });

        // Update local state
        group.value.name = editForm.name;
        group.value.description = editForm.description;

        showEditModal.value = false;
        showAlert("success", "Group updated successfully");
      } catch (error) {
        console.error("Error updating group:", error);
        showAlert("error", "Failed to update group");
      } finally {
        saving.value = false;
      }
    };

    const searchUsers = async () => {
      if (!userSearchQuery.value.trim()) {
        searchResults.value = [];
        return;
      }

      try {
        // This is a hypothetical endpoint, adjust according to your API
        const response = await apiService.userService.getUsers({
          search: userSearchQuery.value,
        });

        // Filter out users already in the group
        const memberIds = members.value.map((member) => member.id);
        searchResults.value = response.data.filter(
          (user) => !memberIds.includes(user.id)
        );
      } catch (error) {
        console.error("Error searching users:", error);
        showAlert("error", "Failed to search users");
      }
    };

    const selectUser = (user) => {
      selectedUser.value = user;
      searchResults.value = [];
    };

    const cancelAddMember = () => {
      showAddMemberModal.value = false;
      selectedUser.value = null;
      userSearchQuery.value = "";
      searchResults.value = [];
    };

    const addMember = async () => {
      if (!selectedUser.value) return;

      try {
        adding.value = true;

        await apiService.projectGroupService.addMember(
          group.value.id,
          selectedUser.value.id
        );

        // Reload members
        await loadMembers();

        cancelAddMember();
        showAlert("success", "Member added successfully");
      } catch (error) {
        console.error("Error adding member:", error);
        showAlert("error", "Failed to add member");
      } finally {
        adding.value = false;
      }
    };

    const confirmRemoveMember = (member) => {
      // Don't allow removing self
      if (member.id === user.value.id) return;

      confirmModal.title = "Remove Member";
      confirmModal.message = `Are you sure you want to remove ${member.firstName} ${member.lastName} from this group?`;
      confirmModal.action = () => removeMember(member);

      showConfirmModal.value = true;
    };

    const removeMember = async (member) => {
      try {
        await apiService.projectGroupService.removeMember(
          group.value.id,
          member.id
        );

        // Update local state
        members.value = members.value.filter((m) => m.id !== member.id);

        showConfirmModal.value = false;
        showAlert("success", "Member removed successfully");
      } catch (error) {
        console.error("Error removing member:", error);
        showAlert("error", "Failed to remove member");
      }
    };

    const searchProjects = async () => {
      if (!projectSearchQuery.value.trim()) {
        projectSearchResults.value = [];
        return;
      }

      try {
        // This is a hypothetical endpoint, adjust according to your API
        const response = await apiService.projectService.getProjects({
          search: projectSearchQuery.value,
          status: "active",
        });

        // Filter out projects already assigned to the group
        const projectIds = projects.value.map((project) => project.id);
        projectSearchResults.value = response.data.filter(
          (project) => !projectIds.includes(project.id)
        );
      } catch (error) {
        console.error("Error searching projects:", error);
        showAlert("error", "Failed to search projects");
      }
    };

    const selectProject = (project) => {
      selectedProject.value = project;
      projectSearchResults.value = [];
    };

    const cancelAssignProject = () => {
      showAssignProjectModal.value = false;
      selectedProject.value = null;
      projectSearchQuery.value = "";
      projectSearchResults.value = [];
    };

    const assignProject = async () => {
      if (!selectedProject.value) return;

      try {
        assigning.value = true;

        await apiService.projectGroupService.assignProject(
          group.value.id,
          selectedProject.value.id
        );

        // Reload projects
        await loadProjects();

        cancelAssignProject();
        showAlert("success", "Project assigned successfully");
      } catch (error) {
        console.error("Error assigning project:", error);
        showAlert("error", "Failed to assign project");
      } finally {
        assigning.value = false;
      }
    };

    const confirmDeleteGroup = () => {
      confirmModal.title = "Delete Group";
      confirmModal.message = `Are you sure you want to delete the group "${group.value.name}"? This action cannot be undone.`;
      confirmModal.action = deleteGroup;

      showConfirmModal.value = true;
    };

    const deleteGroup = async () => {
      try {
        await apiService.projectGroupService.deleteGroup(group.value.id);

        showConfirmModal.value = false;
        showAlert("success", "Group deleted successfully");

        // Redirect back to groups list
        setTimeout(() => {
          router.push("/project-groups");
        }, 1500);
      } catch (error) {
        console.error("Error deleting group:", error);
        showAlert("error", "Failed to delete group");
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";

      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    };

    // Lifecycle hooks
    onMounted(() => {
      loadGroup();
    });

    // Watch for edit modal opening
    const prepareEditForm = () => {
      editForm.name = group.value.name || "";
      editForm.description = group.value.description || "";
    };

    return {
      loading,
      saving,
      adding,
      assigning,
      group,
      members,
      projects,
      activeTab,
      showEditModal,
      showAddMemberModal,
      showAssignProjectModal,
      showConfirmModal,
      confirmModal,
      editForm,
      userSearchQuery,
      searchResults,
      selectedUser,
      projectSearchQuery,
      projectSearchResults,
      selectedProject,
      alert,
      user,
      canManageGroup,

      // Methods
      updateGroup,
      searchUsers,
      selectUser,
      cancelAddMember,
      addMember,
      confirmRemoveMember,
      searchProjects,
      selectProject,
      cancelAssignProject,
      assignProject,
      confirmDeleteGroup,
      formatDate,
      prepareEditForm,
    };
  },
  watch: {
    showEditModal(newVal) {
      if (newVal) {
        this.prepareEditForm();
      }
    },
  },
};
</script>
