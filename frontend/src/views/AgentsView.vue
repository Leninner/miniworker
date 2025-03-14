<template>
  <AppLayout>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">AI Agents</h1>
        <div v-if="authStore.isAdmin">
          <button @click="showCreateAgentModal = true" class="btn btn-primary">
            Create New Agent
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Filter by personality -->
          <div>
            <label
              for="personality-filter"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Personality</label
            >
            <select
              id="personality-filter"
              v-model="filters.personality"
              class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
              @change="filterAgents"
            >
              <option value="">All Personalities</option>
              <option value="demanding">Demanding</option>
              <option value="supportive">Supportive</option>
              <option value="analytical">Analytical</option>
              <option value="creative">Creative</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>

          <!-- Filter by category -->
          <div>
            <label
              for="category-filter"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Problem Category</label
            >
            <select
              id="category-filter"
              v-model="filters.category"
              class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
              @change="filterAgents"
            >
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="automation">Automation</option>
              <option value="process_improvement">Process Improvement</option>
              <option value="innovation">Innovation</option>
              <option value="social">Social</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label
              for="search"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Search</label
            >
            <input
              id="search"
              type="text"
              v-model="filters.search"
              class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
              placeholder="Search by name or description"
              @input="filterAgents"
            />
          </div>
        </div>
      </div>

      <!-- Agents list -->
      <div v-if="isLoading" class="flex justify-center py-12">
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
        v-else-if="filteredAgents.length === 0"
        class="text-center py-12 bg-white rounded-lg shadow"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No agents found</h3>
        <p class="mt-1 text-gray-500">
          Try changing your search or filter criteria.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="agent in filteredAgents"
          :key="agent.id"
          class="bg-white shadow rounded-lg overflow-hidden"
        >
          <!-- Agent header with personality indicator -->
          <div
            class="p-4 border-b border-gray-200"
            :class="getPersonalityClass(agent.personality)"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-white">{{ agent.name }}</h3>
              <span
                class="badge text-xs font-semibold uppercase text-white border border-white"
              >
                {{ formatPersonality(agent.personality) }}
              </span>
            </div>
          </div>

          <!-- Agent details -->
          <div class="p-4">
            <div class="mb-3">
              <span class="badge badge-blue">{{
                formatCategory(agent.problemCategory)
              }}</span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-3 mb-4">
              {{ agent.description }}
            </p>

            <div class="flex justify-between items-center">
              <router-link
                :to="`/agents/${agent.id}`"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </router-link>

              <div v-if="authStore.isAdmin" class="flex space-x-2">
                <button
                  @click="editAgent(agent)"
                  class="text-gray-600 hover:text-gray-800"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="confirmDeleteAgent(agent)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Agent Modal (simplified version) -->
      <div
        v-if="showCreateAgentModal || showEditAgentModal"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div
          class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6"
        >
          <h2 class="text-xl font-bold mb-4">
            {{ showEditAgentModal ? "Edit Agent" : "Create New Agent" }}
          </h2>

          <form
            @submit.prevent="showEditAgentModal ? updateAgent() : createAgent()"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  for="agent-name"
                  class="block text-sm font-medium text-neutral-700 mb-2"
                  >Name</label
                >
                <input
                  id="agent-name"
                  type="text"
                  v-model="agentForm.name"
                  class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  required
                />
              </div>

              <div>
                <label
                  for="agent-personality"
                  class="block text-sm font-medium text-neutral-700 mb-2"
                  >Personality</label
                >
                <select
                  id="agent-personality"
                  v-model="agentForm.personality"
                  class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  required
                >
                  <option value="demanding">Demanding</option>
                  <option value="supportive">Supportive</option>
                  <option value="analytical">Analytical</option>
                  <option value="creative">Creative</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
            </div>

            <div class="mb-4">
              <label
                for="agent-problem-category"
                class="block text-sm font-medium text-neutral-700 mb-2"
                >Problem Category</label
              >
              <select
                id="agent-problem-category"
                v-model="agentForm.problemCategory"
                class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                required
              >
                <option value="technology">Technology</option>
                <option value="automation">Automation</option>
                <option value="process_improvement">Process Improvement</option>
                <option value="innovation">Innovation</option>
                <option value="social">Social</option>
              </select>
            </div>

            <div class="mb-4">
              <label
                for="agent-description"
                class="block text-sm font-medium text-neutral-700 mb-2"
                >Description</label
              >
              <textarea
                id="agent-description"
                v-model="agentForm.description"
                class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="mb-4">
              <label
                for="agent-problem-statement"
                class="block text-sm font-medium text-neutral-700 mb-2"
                >Problem Statement</label
              >
              <textarea
                id="agent-problem-statement"
                v-model="agentForm.problemStatement"
                class="w-full py-2 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeAgentModal"
                class="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Saving..." : "Save" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div
          class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        >
          <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
          <p class="mb-4">
            Are you sure you want to delete agent "{{ agentToDelete?.name }}"?
            This action cannot be undone.
          </p>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showDeleteModal = false"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="deleteAgent"
              class="btn btn-danger"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiService from "@/services/api";
import AppLayout from "@/components/AppLayout.vue";

const router = useRouter();
const authStore = useAuthStore();

interface Agent {
  id: string;
  name: string;
  description: string;
  personality: string;
  problemCategory: string;
  problemStatement: string;
  status?: string;
  type?: string;
  model?: string;
}

// State
const agents = ref<Agent[]>([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const filters = ref({
  personality: "",
  category: "",
  search: "",
});

// Modal state
const showCreateAgentModal = ref(false);
const showEditAgentModal = ref(false);
const showDeleteModal = ref(false);
const agentToDelete = ref<Agent | null>(null);
const agentForm = ref<Agent>({
  id: "",
  name: "",
  description: "",
  personality: "supportive",
  problemCategory: "technology",
  problemStatement: "",
});

// Computed properties
const filteredAgents = computed(() => {
  if (!agents.value) return [];

  return agents.value.filter((agent) => {
    // Filter by personality
    if (
      filters.value.personality &&
      agent.personality !== filters.value.personality
    ) {
      return false;
    }

    // Filter by category
    if (
      filters.value.category &&
      agent.problemCategory !== filters.value.category
    ) {
      return false;
    }

    // Filter by search term
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      return (
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.description.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
});

// Lifecycle hooks
onMounted(async () => {
  await fetchAgents();
});

// Methods
const fetchAgents = async () => {
  isLoading.value = true;
  try {
    const response = await apiService.agentService.getAgents();
    agents.value = response.data;
  } catch (error) {
    console.error("Error fetching agents:", error);
  } finally {
    isLoading.value = false;
  }
};

const filterAgents = () => {
  // This is called when filters change - no need for implementation as we're using computed property
};

const formatPersonality = (personality: string): string => {
  return personality
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatCategory = (category: string): string => {
  return category
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getPersonalityClass = (personality: string): string => {
  const classes: { [key: string]: string } = {
    demanding: "bg-red-600",
    supportive: "bg-green-600",
    analytical: "bg-blue-600",
    creative: "bg-purple-600",
    challenging: "bg-orange-600",
  };

  return classes[personality] || "bg-gray-600";
};

const editAgent = (agent: Agent): void => {
  agentForm.value = { ...agent };
  showEditAgentModal.value = true;
};

const confirmDeleteAgent = (agent: Agent): void => {
  agentToDelete.value = agent;
  showDeleteModal.value = true;
};

const closeAgentModal = () => {
  showCreateAgentModal.value = false;
  showEditAgentModal.value = false;
  resetAgentForm();
};

const resetAgentForm = () => {
  agentForm.value = {
    id: "",
    name: "",
    description: "",
    personality: "supportive",
    problemCategory: "technology",
    problemStatement: "",
  };
};

const createAgent = async () => {
  isSubmitting.value = true;
  try {
    await apiService.agentService.createAgent(agentForm.value);
    await fetchAgents();
    closeAgentModal();
  } catch (error) {
    console.error("Error creating agent:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const updateAgent = async () => {
  isSubmitting.value = true;
  try {
    await apiService.agentService.updateAgent(
      agentForm.value.id,
      agentForm.value
    );
    await fetchAgents();
    closeAgentModal();
  } catch (error) {
    console.error("Error updating agent:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const deleteAgent = async () => {
  if (!agentToDelete.value) return;

  isSubmitting.value = true;
  try {
    await apiService.agentService.deleteAgent(agentToDelete.value.id);
    await fetchAgents();
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Error deleting agent:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
