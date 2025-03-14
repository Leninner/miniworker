<template>
  <div class="project-groups-view">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Project Groups</h1>
        <button
          v-if="canCreateGroups"
          @click="showCreateModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Group
        </button>
      </div>

      <!-- Groups list -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>
      <div
        v-else-if="groups.length === 0"
        class="bg-white shadow rounded-lg p-8 text-center"
      >
        <p class="text-lg text-gray-600 mb-4">No project groups found.</p>
        <p v-if="canCreateGroups" class="text-gray-500">
          Click the "Create New Group" button to create your first group.
        </p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="group in groups"
          :key="group.id"
          class="bg-white shadow rounded-lg overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-800">
                {{ group.name }}
              </h2>
              <span
                class="px-3 py-1 text-xs rounded-full"
                :class="
                  group.type === 'individual'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                "
              >
                {{ group.type === "individual" ? "Individual" : "Team" }}
              </span>
            </div>
            <p v-if="group.description" class="mt-2 text-gray-600">
              {{ group.description }}
            </p>
          </div>

          <div class="px-6 py-4">
            <h3 class="font-medium text-gray-700 mb-2">
              Members ({{ group.members.length }})
            </h3>
            <div
              v-if="group.members.length === 0"
              class="text-gray-500 text-sm"
            >
              No members yet
            </div>
            <ul v-else class="space-y-2">
              <li
                v-for="member in group.members"
                :key="member.id"
                class="flex items-center justify-between"
              >
                <div class="flex items-center">
                  <img
                    v-if="member.profilePicture"
                    :src="member.profilePicture"
                    alt="Profile"
                    class="w-8 h-8 rounded-full mr-3"
                  />
                  <div
                    v-else
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3"
                  >
                    <span class="text-gray-600 text-sm"
                      >{{ member.firstName.charAt(0)
                      }}{{ member.lastName.charAt(0) }}</span
                    >
                  </div>
                  <span>{{ member.firstName }} {{ member.lastName }}</span>
                </div>
                <button
                  v-if="canManageGroup(group)"
                  @click="removeMember(group.id, member.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </li>
            </ul>
          </div>

          <div
            v-if="group.projects && group.projects.length > 0"
            class="px-6 py-4 border-t border-gray-200"
          >
            <h3 class="font-medium text-gray-700 mb-2">
              Projects ({{ group.projects.length }})
            </h3>
            <ul class="space-y-2">
              <li
                v-for="project in group.projects"
                :key="project.id"
                class="text-blue-600 hover:text-blue-800"
              >
                <router-link
                  :to="{ name: 'ProjectDetail', params: { id: project.id } }"
                >
                  {{ project.title }}
                </router-link>
              </li>
            </ul>
          </div>

          <div
            v-if="canManageGroup(group)"
            class="px-6 py-4 border-t border-gray-200 bg-gray-50"
          >
            <div class="flex justify-between">
              <button
                @click="editGroup(group)"
                class="text-blue-600 hover:text-blue-800"
              >
                Edit Group
              </button>
              <button
                @click="confirmDeleteGroup(group)"
                class="text-red-600 hover:text-red-800"
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">
            {{ showEditModal ? "Edit Group" : "Create New Group" }}
          </h2>

          <form @submit.prevent="showEditModal ? updateGroup() : createGroup()">
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="name"
              >
                Group Name
              </label>
              <input
                id="name"
                v-model="groupForm.name"
                type="text"
                class="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>

            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="description"
              >
                Description
              </label>
              <textarea
                id="description"
                v-model="groupForm.description"
                class="shadow border rounded w-full py-2 px-3 text-gray-700"
                rows="3"
              ></textarea>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Group Type
              </label>
              <div class="flex">
                <label class="mr-4">
                  <input
                    type="radio"
                    v-model="groupForm.type"
                    value="individual"
                    class="mr-2"
                  />
                  Individual
                </label>
                <label>
                  <input
                    type="radio"
                    v-model="groupForm.type"
                    value="team"
                    class="mr-2"
                  />
                  Team
                </label>
              </div>
            </div>

            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="members"
              >
                Members
              </label>
              <select
                id="members"
                v-model="groupForm.selectedMembers"
                multiple
                class="shadow border rounded w-full py-2 px-3 text-gray-700"
              >
                <option
                  v-for="student in availableStudents"
                  :key="student.id"
                  :value="student.id"
                >
                  {{ student.firstName }} {{ student.lastName }}
                </option>
              </select>
              <p class="text-gray-500 text-xs mt-1">
                Hold Ctrl/Cmd to select multiple students
              </p>
            </div>

            <div class="flex justify-end">
              <button
                type="button"
                @click="closeModal"
                class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                :disabled="loading"
              >
                {{ showEditModal ? "Update" : "Create" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">Confirm Delete</h2>
          <p class="mb-6">
            Are you sure you want to delete the group "{{
              groupToDelete?.name
            }}"? This action cannot be undone.
          </p>

          <div class="flex justify-end">
            <button
              @click="showDeleteModal = false"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              @click="deleteGroup()"
              class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              :disabled="loading"
            >
              Delete
            </button>
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
import api from "@/services/api";

const authStore = useAuthStore();
const router = useRouter();

// Data
const groups = ref([]);
const availableStudents = ref([]);
const loading = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const groupToDelete = ref(null);
const groupForm = ref({
  name: "",
  description: "",
  type: "team",
  selectedMembers: [],
});
const editingGroupId = ref(null);

// Computed
const canCreateGroups = computed(() => {
  return authStore.userRole === "professor" || authStore.userRole === "admin";
});

// Methods
const fetchGroups = async () => {
  loading.value = true;
  try {
    let response;
    if (authStore.userRole === "professor") {
      response = await api.projectGroupService.getManagedGroups();
    } else if (authStore.userRole === "admin") {
      response = await api.projectGroupService.getGroups();
    } else {
      // Student - fetch groups they belong to
      // This endpoint would need to be implemented in the backend
      response = await api.projectGroupService.getManagedGroups();
    }
    groups.value = response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
  } finally {
    loading.value = false;
  }
};

const fetchStudents = async () => {
  try {
    const response = await api.userService.getUsers({
      params: { role: "student" },
    });
    availableStudents.value = response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

const canManageGroup = (group) => {
  return authStore.userRole === "admin" || group.managerId === authStore.userId;
};

const createGroup = async () => {
  loading.value = true;
  try {
    await api.projectGroupService.createGroup({
      name: groupForm.value.name,
      description: groupForm.value.description || null,
      type: groupForm.value.type,
      memberIds: groupForm.value.selectedMembers,
    });
    closeModal();
    fetchGroups();
  } catch (error) {
    console.error("Error creating group:", error);
  } finally {
    loading.value = false;
  }
};

const editGroup = (group) => {
  editingGroupId.value = group.id;
  groupForm.value = {
    name: group.name,
    description: group.description || "",
    type: group.type,
    selectedMembers: group.members.map((member) => member.id),
  };
  showEditModal.value = true;
};

const updateGroup = async () => {
  loading.value = true;
  try {
    await api.projectGroupService.updateGroup(editingGroupId.value, {
      name: groupForm.value.name,
      description: groupForm.value.description || null,
      type: groupForm.value.type,
      memberIds: groupForm.value.selectedMembers,
    });
    closeModal();
    fetchGroups();
  } catch (error) {
    console.error("Error updating group:", error);
  } finally {
    loading.value = false;
  }
};

const confirmDeleteGroup = (group) => {
  groupToDelete.value = group;
  showDeleteModal.value = true;
};

const deleteGroup = async () => {
  loading.value = true;
  try {
    await api.projectGroupService.deleteGroup(groupToDelete.value.id);
    showDeleteModal.value = false;
    fetchGroups();
  } catch (error) {
    console.error("Error deleting group:", error);
  } finally {
    loading.value = false;
  }
};

const removeMember = async (groupId, memberId) => {
  loading.value = true;
  try {
    await api.projectGroupService.removeMember(groupId, memberId);
    fetchGroups();
  } catch (error) {
    console.error("Error removing member:", error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingGroupId.value = null;
  groupForm.value = {
    name: "",
    description: "",
    type: "team",
    selectedMembers: [],
  };
};

// Lifecycle
onMounted(async () => {
  await fetchGroups();
  if (canCreateGroups.value) {
    await fetchStudents();
  }
});
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
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
</style>
