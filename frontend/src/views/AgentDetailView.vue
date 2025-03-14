<template>
  <AppLayout>
    <div>
      <!-- Loading state -->
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

      <!-- Agent not found -->
      <div v-else-if="!agent" class="text-center py-12">
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
        <h3 class="mt-2 text-lg font-medium text-gray-900">Agent not found</h3>
        <p class="mt-1 text-gray-500">
          The agent you're looking for doesn't exist or has been removed.
        </p>
        <div class="mt-6">
          <router-link to="/agents" class="btn btn-primary"
            >Back to Agents</router-link
          >
        </div>
      </div>

      <!-- Agent details -->
      <div v-else>
        <!-- Page header with actions -->
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        >
          <div>
            <div class="flex items-center">
              <router-link
                to="/agents"
                class="text-gray-500 hover:text-gray-700 mr-2"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
              </router-link>
              <h1 class="text-2xl font-bold text-gray-900">{{ agent.name }}</h1>
            </div>
            <div class="flex items-center mt-1">
              <span
                class="badge mr-2"
                :class="getPersonalityBadgeClass(agent.personality)"
              >
                {{ formatPersonality(agent.personality) }}
              </span>
              <span class="badge badge-blue">
                {{ formatCategory(agent.problemCategory) }}
              </span>
            </div>
          </div>

          <div class="mt-4 md:mt-0 flex space-x-3" v-if="authStore.isAdmin">
            <button
              @click="editAgent"
              class="btn btn-secondary flex items-center"
            >
              <svg
                class="h-4 w-4 mr-1"
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
              Edit
            </button>
            <button
              @click="deleteAgent"
              class="btn btn-danger flex items-center"
            >
              <svg
                class="h-4 w-4 mr-1"
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
              Delete
            </button>
          </div>
        </div>

        <!-- Agent content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Agent info & stats -->
          <div class="lg:col-span-2">
            <!-- Agent greeting (using strategy pattern) -->
            <div class="bg-white p-6 shadow rounded-lg mb-6">
              <blockquote
                class="text-lg font-medium text-gray-700 italic border-l-4 pl-4"
                :class="getPersonalityBorderClass(agent.personality)"
              >
                "{{ agentGreeting }}"
              </blockquote>
            </div>

            <!-- Agent description -->
            <div class="bg-white p-6 shadow rounded-lg mb-6">
              <h2 class="text-xl font-semibold mb-4">About this Agent</h2>
              <p class="text-gray-700">{{ agent.description }}</p>
            </div>

            <!-- Problem statement -->
            <div class="bg-white p-6 shadow rounded-lg mb-6">
              <h2 class="text-xl font-semibold mb-4">Problem Statement</h2>
              <p class="text-gray-700">{{ agent.problemStatement }}</p>
            </div>

            <!-- Strategy characteristics -->
            <div class="bg-white p-6 shadow rounded-lg mb-6">
              <h2 class="text-xl font-semibold mb-4">Personality Profile</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 class="font-medium text-gray-900 mb-2">
                    Communication Style
                  </h3>
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li
                      v-for="(trait, index) in communicationTraits"
                      :key="index"
                    >
                      {{ trait }}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 class="font-medium text-gray-900 mb-2">
                    Feedback Approach
                  </h3>
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li v-for="(trait, index) in feedbackTraits" :key="index">
                      {{ trait }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Sample feedback (using strategy pattern) -->
            <div class="bg-white p-6 shadow rounded-lg mb-6">
              <h2 class="text-xl font-semibold mb-4">Sample Feedback</h2>

              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-start mb-3">
                  <div class="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                    <svg
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <p class="text-gray-800">
                    I've been working on a solution for optimizing our shipping
                    routes. Here's my initial approach...
                  </p>
                </div>

                <div class="bg-white p-3 rounded-lg border border-gray-200">
                  <p class="text-gray-700">{{ agentFeedback }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar: Stats, Projects, Actions -->
          <div>
            <!-- Agent statistics -->
            <div class="bg-white p-6 shadow rounded-lg mb-6">
              <h2 class="text-lg font-semibold mb-4">Statistics</h2>

              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">Active Projects</span>
                  <span class="font-medium">{{
                    agent.projects?.length || 0
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Created</span>
                  <span class="font-medium">{{
                    formatDate(agent.createdAt)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Last Updated</span>
                  <span class="font-medium">{{
                    formatDate(agent.updatedAt)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Status</span>
                  <span class="font-medium text-green-600">{{
                    agent.isActive ? "Active" : "Inactive"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Next steps (using strategy pattern) -->
            <div class="bg-white p-6 shadow rounded-lg mb-6">
              <h2 class="text-lg font-semibold mb-4">Recommended Approach</h2>

              <ul class="space-y-2">
                <li
                  v-for="(step, index) in agentNextSteps"
                  :key="index"
                  class="flex items-start"
                >
                  <svg
                    class="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="text-gray-700">{{ step }}</span>
                </li>
              </ul>
            </div>

            <!-- Start a project with this agent -->
            <div class="bg-white p-6 shadow rounded-lg mb-6">
              <h2 class="text-lg font-semibold mb-4">Work with this Agent</h2>
              <p class="text-gray-600 mb-4">
                Interested in tackling this agent's problem statement? Start a
                new project to collaborate with this AI agent.
              </p>
              <router-link
                :to="{ name: 'create-project', query: { agent: agent.id } }"
                class="btn btn-primary w-full"
                v-if="authStore.isStudent"
              >
                Start New Project
              </router-link>
              <p v-else class="text-sm text-gray-500 text-center">
                Only students can create new projects
              </p>
            </div>
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
              Are you sure you want to delete agent "{{ agent.name }}"? This
              action cannot be undone.
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
                @click="confirmDelete"
                class="btn btn-danger"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Deleting..." : "Delete" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppLayout from "@/components/AppLayout.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// State
const agent = ref(null) as any;
const isLoading = ref(true);
const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const agentGreeting = ref("");
const agentFeedback = ref("");
const agentNextSteps = ref([]);

// Computed properties for the strategy pattern displays
const communicationTraits = computed(() => {
  const personalityTraits = {
    demanding: [
      "Direct and expectation-setting",
      "Clear deadlines and expectations",
      "High standards for all communications",
      "Minimal small talk, focused on results",
    ],
    supportive: [
      "Encouraging and positive",
      "Emphasis on strengths and progress",
      "Open and inviting dialogue",
      "Flexible and understanding approach",
    ],
    analytical: [
      "Data-driven and objective",
      "Precise and detailed explanations",
      "Systematic exploration of concepts",
      "Focus on logic over emotions",
    ],
    creative: [
      "Enthusiastic and imaginative",
      "Encourages thinking outside the box",
      "Uses analogies and visual language",
      "Values novel and unique perspectives",
    ],
    challenging: [
      "Asks probing questions",
      "Pushes boundaries of thinking",
      "Tests assumptions and ideas",
      "Encourages critical thinking",
    ],
  };

  return agent.value ? personalityTraits[agent.value.personality] || [] : [];
});

const feedbackTraits = computed(() => {
  const personalityTraits = {
    demanding: [
      "Rigorous assessment of deliverables",
      "Points out areas needing improvement",
      "Rewards excellence with recognition",
      "Low tolerance for careless mistakes",
    ],
    supportive: [
      "Focuses on progress and growth",
      "Gentle suggestions for improvement",
      "Offers help and guidance",
      "Acknowledges effort and perseverance",
    ],
    analytical: [
      "Evidence-based evaluation",
      "Objective metrics for assessment",
      "Systematic breakdown of strengths/weaknesses",
      "Detached and impartial perspective",
    ],
    creative: [
      "Appreciates unconventional solutions",
      "Encourages experimentation",
      "Values unique approaches",
      "Suggests creative alternatives",
    ],
    challenging: [
      "Pushes for deeper analysis",
      "Questions underlying assumptions",
      "Focuses on edge cases and weak points",
      "Encourages self-critique",
    ],
  };

  return agent.value ? personalityTraits[agent.value.personality] || [] : [];
});

// Lifecycle hooks
onMounted(async () => {
  const agentId = route.params.id;
  await fetchAgent(agentId);
});

// Methods
const fetchAgent = async (id) => {
  isLoading.value = true;
  try {
    // Fetch basic agent data
    const response = await agentService.getAgent(id);
    agent.value = response.data;

    // Fetch AI-generated content from backend
    if (agent.value) {
      // Get AI-generated greeting
      const greetingResponse = await agentService.getAgentGreeting(id);
      agentGreeting.value = greetingResponse.data.greeting;

      // Get AI-generated feedback sample
      const feedbackResponse = await agentService.getAgentFeedback(
        id,
        "I've been working on a solution for optimizing our shipping routes. Here's my initial approach..."
      );
      agentFeedback.value = feedbackResponse.data.feedback;

      // Get AI-generated next steps
      const nextStepsResponse = await agentService.getNextSteps(id, null);
      agentNextSteps.value = nextStepsResponse.data.steps;
    }
  } catch (error) {
    console.error("Error fetching agent:", error);
    agent.value = null;

    // Fallback mock data in case the backend is not available
    if (error.response && error.response.status === 404) {
      // Agent not found - leave as null
    } else {
      // Temporary mock data for development
      agent.value = {
        id: id,
        name: "Sample Agent",
        personality: "supportive",
        problemCategory: "technology",
        description: "A sample agent for development",
        problemStatement: "This is a sample problem statement.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      agentGreeting.value =
        "Hello! I'm a sample AI agent. This is a fallback greeting while the backend is being implemented.";
      agentFeedback.value =
        "This is a sample feedback message that would normally come from OpenAI in the backend.";
      agentNextSteps.value = [
        "Step 1: Define the problem clearly",
        "Step 2: Research existing solutions",
        "Step 3: Develop a prototype",
      ];
    }
  } finally {
    isLoading.value = false;
  }
};

const formatPersonality = (personality) => {
  return personality
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatCategory = (category) => {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

const getPersonalityBadgeClass = (personality) => {
  const classes = {
    demanding: "badge-red",
    supportive: "badge-green",
    analytical: "badge-blue",
    creative: "badge-purple",
    challenging: "badge-yellow",
  };

  return classes[personality] || "badge-gray";
};

const getPersonalityBorderClass = (personality) => {
  const classes = {
    demanding: "border-red-500",
    supportive: "border-green-500",
    analytical: "border-blue-500",
    creative: "border-purple-500",
    challenging: "border-yellow-500",
  };

  return classes[personality] || "border-gray-300";
};

const editAgent = () => {
  router.push(`/agents/edit/${agent.value.id}`);
};

const deleteAgent = () => {
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  isSubmitting.value = true;
  try {
    await agentService.deleteAgent(agent.value.id);
    router.push("/agents");
  } catch (error) {
    console.error("Error deleting agent:", error);
  } finally {
    isSubmitting.value = false;
    showDeleteModal.value = false;
  }
};
</script>
