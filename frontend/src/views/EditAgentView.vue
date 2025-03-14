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
          :to="`/agents/${agentId}`"
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
          Back to Agent Details
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Agent</h1>

        <form @submit.prevent="saveAgent">
          <!-- Basic Info Section -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Name <span class="text-red-500">*</span></label
                >
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Type -->
              <div>
                <label
                  for="type"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Type <span class="text-red-500">*</span></label
                >
                <select
                  id="type"
                  v-model="form.type"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mentor">Mentor</option>
                  <option value="evaluator">Evaluator</option>
                  <option value="assistant">Assistant</option>
                </select>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Description <span class="text-red-500">*</span></label
                >
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <!-- Avatar URL -->
              <div class="md:col-span-2">
                <label
                  for="avatarUrl"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Avatar URL</label
                >
                <input
                  id="avatarUrl"
                  v-model="form.avatarUrl"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">
                  URL to an image that will be used as the agent's avatar
                </p>
              </div>
            </div>
          </div>

          <!-- AI Configuration Section -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              AI Configuration
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- AI Model -->
              <div>
                <label
                  for="model"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >AI Model <span class="text-red-500">*</span></label
                >
                <select
                  id="model"
                  v-model="form.model"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </select>
              </div>

              <!-- Temperature -->
              <div>
                <label
                  for="temperature"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Temperature <span class="text-red-500">*</span></label
                >
                <div class="flex items-center">
                  <input
                    id="temperature"
                    v-model="form.temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    class="w-full mr-3"
                  />
                  <span class="text-sm font-medium">{{
                    form.temperature
                  }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Lower values make the response more deterministic, higher
                  values more creative
                </p>
              </div>

              <!-- System Prompt -->
              <div class="md:col-span-2">
                <label
                  for="systemPrompt"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >System Prompt <span class="text-red-500">*</span></label
                >
                <textarea
                  id="systemPrompt"
                  v-model="form.systemPrompt"
                  rows="6"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="You are a helpful assistant..."
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">
                  Instructions that define how the AI behaves
                </p>
              </div>
            </div>
          </div>

          <!-- Advanced Section -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Advanced Settings
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Max Tokens -->
              <div>
                <label
                  for="maxTokens"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Max Tokens</label
                >
                <input
                  id="maxTokens"
                  v-model.number="form.maxTokens"
                  type="number"
                  min="1"
                  max="8192"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Maximum number of tokens in the response (leave empty for
                  model default)
                </p>
              </div>

              <!-- Top P -->
              <div>
                <label
                  for="topP"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Top P</label
                >
                <div class="flex items-center">
                  <input
                    id="topP"
                    v-model="form.topP"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    class="w-full mr-3"
                  />
                  <span class="text-sm font-medium">{{ form.topP }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Controls diversity via nucleus sampling
                </p>
              </div>

              <!-- Frequency Penalty -->
              <div>
                <label
                  for="frequencyPenalty"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Frequency Penalty</label
                >
                <div class="flex items-center">
                  <input
                    id="frequencyPenalty"
                    v-model="form.frequencyPenalty"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    class="w-full mr-3"
                  />
                  <span class="text-sm font-medium">{{
                    form.frequencyPenalty
                  }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Reduces repetition of token sequences
                </p>
              </div>

              <!-- Presence Penalty -->
              <div>
                <label
                  for="presencePenalty"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Presence Penalty</label
                >
                <div class="flex items-center">
                  <input
                    id="presencePenalty"
                    v-model="form.presencePenalty"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    class="w-full mr-3"
                  />
                  <span class="text-sm font-medium">{{
                    form.presencePenalty
                  }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Encourages the model to talk about new topics
                </p>
              </div>
            </div>
          </div>

          <!-- Status Section -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Status</h2>

            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="form.isActive"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-gray-700">Active</span>
              </label>
              <p class="text-xs text-gray-500 mt-1 ml-6">
                When disabled, this agent will not be available for use
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-8">
            <router-link
              :to="`/agents/${agentId}`"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="saving"
            >
              {{ saving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
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
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { agentService } from "@/services/api";

export default {
  name: "EditAgentView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const agentId = computed(() => route.params.id);

    // States
    const loading = ref(true);
    const saving = ref(false);
    const form = reactive({
      name: "",
      type: "mentor",
      description: "",
      avatarUrl: "",
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      systemPrompt: "",
      isActive: true,
    });

    // Alert state
    const alert = reactive({
      show: false,
      type: "success",
      message: "",
    });

    // Check if user has permission
    if (!authStore.isAdmin) {
      router.push("/dashboard");
      return;
    }

    // Methods
    const showAlert = (type, message) => {
      alert.show = true;
      alert.type = type;
      alert.message = message;

      setTimeout(() => {
        alert.show = false;
      }, 3000);
    };

    const loadAgent = async () => {
      try {
        loading.value = true;
        const response = await agentService.getAgent(agentId.value);
        const agent = response.data;

        // Populate form
        form.name = agent.name;
        form.type = agent.type;
        form.description = agent.description;
        form.avatarUrl = agent.avatarUrl || "";
        form.model = agent.config?.model || "gpt-4";
        form.temperature = agent.config?.temperature ?? 0.7;
        form.maxTokens = agent.config?.maxTokens || 2048;
        form.topP = agent.config?.topP ?? 1;
        form.frequencyPenalty = agent.config?.frequencyPenalty ?? 0;
        form.presencePenalty = agent.config?.presencePenalty ?? 0;
        form.systemPrompt = agent.config?.systemPrompt || "";
        form.isActive = agent.isActive;
      } catch (error) {
        console.error("Error loading agent:", error);
        showAlert("error", "Failed to load agent details");
        router.push("/agents");
      } finally {
        loading.value = false;
      }
    };

    const saveAgent = async () => {
      try {
        saving.value = true;

        const agentData = {
          name: form.name,
          type: form.type,
          description: form.description,
          avatarUrl: form.avatarUrl,
          isActive: form.isActive,
          config: {
            model: form.model,
            temperature: parseFloat(form.temperature),
            maxTokens: parseInt(form.maxTokens, 10),
            topP: parseFloat(form.topP),
            frequencyPenalty: parseFloat(form.frequencyPenalty),
            presencePenalty: parseFloat(form.presencePenalty),
            systemPrompt: form.systemPrompt,
          },
        };

        await agentService.updateAgent(agentId.value, agentData);

        showAlert("success", "Agent updated successfully");

        // Redirect after a small delay
        setTimeout(() => {
          router.push(`/agents/${agentId.value}`);
        }, 1500);
      } catch (error) {
        console.error("Error updating agent:", error);
        showAlert(
          "error",
          error.response?.data?.message || "Failed to update agent"
        );
      } finally {
        saving.value = false;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      loadAgent();
    });

    return {
      agentId,
      loading,
      saving,
      form,
      alert,
      saveAgent,
    };
  },
};
</script>
