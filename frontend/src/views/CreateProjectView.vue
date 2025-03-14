<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto">
      <h1 class="page-title">Create New Project</h1>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <!-- Project Form -->
        <div class="px-4 py-5 sm:p-6">
          <form @submit.prevent="createProject">
            <div class="space-y-6">
              <!-- Project Title -->
              <div>
                <label for="title" class="form-label">Project Title</label>
                <input
                  type="text"
                  id="title"
                  v-model="formData.title"
                  class="form-input"
                  :class="{ 'border-red-300': errors.title }"
                  placeholder="Enter a descriptive title for your project"
                  required
                />
                <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
              </div>

              <!-- Agent Selection -->
              <div>
                <label class="form-label">Select an AI Agent</label>
                <p class="text-sm text-gray-500 mb-4">
                  Choose the AI agent that best matches your project
                  requirements
                </p>

                <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div
                    v-for="agent in availableAgents"
                    :key="agent.id"
                    class="relative border rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                    :class="{
                      'border-blue-500 bg-blue-50':
                        formData.agentId === agent.id,
                      'border-gray-300': formData.agentId !== agent.id,
                    }"
                    @click="selectAgent(agent)"
                  >
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div
                          class="flex items-center justify-center h-10 w-10 rounded-full"
                          :class="{
                            'bg-blue-600': agent.category === 'automation',
                            'bg-green-600': agent.category === 'web_dev',
                            'bg-purple-600':
                              agent.category === 'data_analytics',
                            'bg-red-600': agent.category === 'mobile_dev',
                            'bg-indigo-600': agent.category === 'cybersecurity',
                          }"
                        >
                          <svg
                            class="h-6 w-6 text-white"
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
                        </div>
                      </div>
                      <div class="ml-4">
                        <h3 class="text-sm font-medium text-gray-900">
                          {{ agent.name }}
                        </h3>
                        <div class="mt-1 flex items-center">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2"
                            :class="{
                              'bg-blue-100 text-blue-800':
                                agent.personality === 'analytical',
                              'bg-red-100 text-red-800':
                                agent.personality === 'demanding',
                              'bg-green-100 text-green-800':
                                agent.personality === 'supportive',
                              'bg-purple-100 text-purple-800':
                                agent.personality === 'creative',
                              'bg-orange-100 text-orange-800':
                                agent.personality === 'challenging',
                            }"
                          >
                            {{ agent.personality }}
                          </span>
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {{ formatCategory(agent.category) }}
                          </span>
                        </div>
                        <p class="mt-2 text-sm text-gray-500">
                          {{ agent.description }}
                        </p>
                      </div>
                    </div>
                    <div class="absolute top-4 right-4">
                      <div
                        class="h-5 w-5 border-2 rounded-full flex items-center justify-center"
                        :class="{
                          'border-blue-500 bg-blue-500':
                            formData.agentId === agent.id,
                          'border-gray-300': formData.agentId !== agent.id,
                        }"
                      >
                        <svg
                          v-if="formData.agentId === agent.id"
                          class="h-3 w-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p v-if="errors.agentId" class="form-error mt-2">
                  {{ errors.agentId }}
                </p>
              </div>

              <!-- Problem Statement -->
              <div>
                <label for="problem-statement" class="form-label"
                  >Problem Statement</label
                >
                <p class="text-sm text-gray-500 mb-2">
                  Describe the problem you're trying to solve with this project
                </p>
                <textarea
                  id="problem-statement"
                  v-model="formData.problemStatement"
                  rows="4"
                  class="form-textarea"
                  :class="{ 'border-red-300': errors.problemStatement }"
                  placeholder="Explain the problem, requirements, and goals for this project"
                  required
                ></textarea>
                <p v-if="errors.problemStatement" class="form-error">
                  {{ errors.problemStatement }}
                </p>
              </div>

              <!-- Project Assignment Type -->
              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-medium text-gray-900">
                  Project Assignment
                </h3>
                <p class="text-sm text-gray-500 mt-1 mb-4">
                  Choose whether this is an individual project or for a group
                </p>

                <div class="flex space-x-4 mb-4">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      v-model="formData.projectType"
                      value="individual"
                      class="form-radio h-4 w-4 text-blue-600"
                    />
                    <span class="ml-2">Individual Project</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      v-model="formData.projectType"
                      value="group"
                      class="form-radio h-4 w-4 text-blue-600"
                    />
                    <span class="ml-2">Group Project</span>
                  </label>
                </div>

                <!-- Group Selection (only for group projects) -->
                <div v-if="formData.projectType === 'group'" class="mt-4">
                  <label for="group-select" class="form-label"
                    >Select Group</label
                  >
                  <select
                    id="group-select"
                    v-model="formData.groupId"
                    class="form-select"
                    :class="{ 'border-red-300': errors.groupId }"
                    required
                  >
                    <option value="" disabled>Select a group</option>
                    <option
                      v-for="group in availableGroups"
                      :key="group.id"
                      :value="group.id"
                    >
                      {{ group.name }} ({{ group.members.length }} members)
                    </option>
                  </select>
                  <p v-if="errors.groupId" class="form-error">
                    {{ errors.groupId }}
                  </p>
                  <p
                    v-if="
                      !availableGroups.length &&
                      formData.projectType === 'group'
                    "
                    class="text-sm text-amber-600 mt-2"
                  >
                    No groups found. Please
                    <router-link
                      to="/project-groups"
                      class="text-blue-600 hover:text-blue-800"
                      >create a group</router-link
                    >
                    first.
                  </p>
                </div>
              </div>

              <!-- Optional Details -->
              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-medium text-gray-900">
                  Optional Details
                </h3>

                <div class="mt-4">
                  <label for="additional-context" class="form-label"
                    >Additional Context</label
                  >
                  <p class="text-sm text-gray-500 mb-2">
                    Provide any additional information that might help the AI
                    agent understand your project better
                  </p>
                  <textarea
                    id="additional-context"
                    v-model="formData.additionalContext"
                    rows="3"
                    class="form-textarea"
                    placeholder="Technical constraints, preferred technologies, existing systems, etc."
                  ></textarea>
                </div>

                <div class="mt-4">
                  <label for="expected-outcome" class="form-label"
                    >Expected Outcome</label
                  >
                  <input
                    type="text"
                    id="expected-outcome"
                    v-model="formData.expectedOutcome"
                    class="form-input"
                    placeholder="What you hope to achieve by the end of this project"
                  />
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <router-link to="/dashboard" class="btn btn-secondary mr-3">
                Cancel
              </router-link>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Creating...
                </span>
                <span v-else>Create Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import AppLayout from "@/components/AppLayout.vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/services/api";

const router = useRouter();
const authStore = useAuthStore();

// Form data
const formData = reactive({
  title: "",
  agentId: "",
  problemStatement: "",
  additionalContext: "",
  expectedOutcome: "",
  projectType: "individual", // Default to individual project
  groupId: "", // For group projects
});

// Form state
const errors = reactive({
  title: "",
  agentId: "",
  problemStatement: "",
  groupId: "",
});
const isSubmitting = ref(false);

// Mock data for available agents
const availableAgents = [
  {
    id: "1",
    name: "Business Automation Agent",
    personality: "analytical",
    category: "automation",
    description:
      "Specializes in business process automation, inventory management, and workflow optimization.",
  },
  {
    id: "2",
    name: "Web Development Agent",
    personality: "creative",
    category: "web_dev",
    description:
      "Helps with web applications, responsive design, and modern frontend frameworks.",
  },
  {
    id: "3",
    name: "Data Analysis Agent",
    personality: "analytical",
    category: "data_analytics",
    description:
      "Assists with data processing, visualization, and insights extraction.",
  },
  {
    id: "4",
    name: "Mobile App Agent",
    personality: "demanding",
    category: "mobile_dev",
    description:
      "Guides mobile application development for iOS and Android platforms.",
  },
  {
    id: "5",
    name: "Cybersecurity Agent",
    personality: "challenging",
    category: "cybersecurity",
    description:
      "Focuses on security best practices, vulnerability assessment, and threat modeling.",
  },
];

// Available groups for selection
const availableGroups = ref([]);

// Fetch available groups for the professor
const fetchAvailableGroups = async () => {
  if (authStore.isProfessor || authStore.isAdmin) {
    try {
      const response = await api.projectGroupService.getManagedGroups();
      availableGroups.value = response.data;
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  } else {
    // For students, fetch the groups they are part of
    try {
      const response = await api.projectGroupService.getManagedGroups();
      availableGroups.value = response.data;
    } catch (error) {
      console.error("Error fetching student groups:", error);
    }
  }
};

// Methods
function selectAgent(agent: any) {
  formData.agentId = agent.id;
}

function formatCategory(category: string) {
  const categoryMap: Record<string, string> = {
    automation: "Business Automation",
    web_dev: "Web Development",
    data_analytics: "Data Analytics",
    mobile_dev: "Mobile Development",
    cybersecurity: "Cybersecurity",
  };

  return categoryMap[category] || category;
}

function validateForm() {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  // Validate title
  if (!formData.title.trim()) {
    errors.title = "Project title is required";
    isValid = false;
  } else if (formData.title.length < 5) {
    errors.title = "Title must be at least 5 characters long";
    isValid = false;
  }

  // Validate agent selection
  if (!formData.agentId) {
    errors.agentId = "Please select an AI agent for your project";
    isValid = false;
  }

  // Validate problem statement
  if (!formData.problemStatement.trim()) {
    errors.problemStatement = "Problem statement is required";
    isValid = false;
  } else if (formData.problemStatement.length < 20) {
    errors.problemStatement =
      "Please provide a more detailed problem statement (at least 20 characters)";
    isValid = false;
  }

  // Validate group selection for group projects
  if (formData.projectType === "group" && !formData.groupId) {
    errors.groupId = "Please select a group for this project";
    isValid = false;
  }

  return isValid;
}

async function createProject() {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const projectData = {
      title: formData.title,
      description: formData.problemStatement,
      requirements: {
        problemStatement: formData.problemStatement,
        additionalContext: formData.additionalContext || "",
        expectedOutcome: formData.expectedOutcome || "",
      },
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Default to 3 months
      agentId: formData.agentId,
      professorId: selectedProfessor.value?.id || "",
    };

    // Add either studentId or groupId based on project type
    if (formData.projectType === "individual") {
      projectData.studentId = authStore.userId;
    } else {
      projectData.groupId = formData.groupId;
    }

    const response = await api.projectService.createProject(projectData);
    console.log(response);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock success response
    const projectId = Math.floor(Math.random() * 1000);

    // Navigate to the new project
    router.push(`/projects/${projectId}`);
  } catch (error) {
    console.error("Error creating project:", error);
    alert("An error occurred while creating your project. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
}

// Lifecycle hooks
onMounted(async () => {
  fetchAvailableAgents();
  fetchAvailableProfessors();
  fetchAvailableGroups();
});
</script>
