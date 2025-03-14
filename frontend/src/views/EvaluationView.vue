<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <!-- Loading state -->
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

      <!-- Header with navigation -->
      <div v-else class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold text-gray-900">Project Evaluation</h1>
          <router-link
            :to="`/projects/${projectId}`"
            class="btn btn-secondary text-sm"
          >
            Back to Project
          </router-link>
        </div>
        <div v-if="project" class="bg-white shadow rounded-lg p-4 mb-4">
          <h2 class="text-xl font-semibold mb-2">{{ project.title }}</h2>
          <div class="flex items-center text-sm text-gray-600 mb-2">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusBadgeClass(project.status)"
            >
              {{ formatText(project.status) }}
            </span>
            <span class="mx-2">•</span>
            <span>Agent: {{ project.agent?.name || "N/A" }}</span>
          </div>
          <p class="text-gray-600">{{ project.description }}</p>
        </div>
      </div>

      <!-- Main content -->
      <div v-if="!isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column: Evaluation spider chart and summary -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Performance Evaluation</h3>

            <!-- Spider Chart -->
            <div
              class="mb-6 h-80 flex justify-center items-center"
              ref="chartContainer"
            >
              <canvas ref="radarChart" width="400" height="300"></canvas>
            </div>

            <!-- Report Downloader Section -->
            <div v-if="evaluation?.id">
              <ReportDownloader
                entityType="evaluation"
                :entityId="evaluation.id"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <!-- Common Criteria Section -->
              <div class="md:col-span-2">
                <h4 class="text-base font-medium text-gray-700 mb-2">
                  Core Skills
                </h4>
              </div>

              <div
                v-for="key in [
                  'technicalSkills',
                  'problemSolving',
                  'creativity',
                  'deliveryQuality',
                ]"
                :key="key"
                class="bg-gray-50 p-4 rounded"
                v-if="
                  evaluation.criteria && evaluation.criteria[key] !== undefined
                "
              >
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium text-gray-700">{{
                    formatCriteriaKey(key)
                  }}</span>
                  <span class="text-sm font-bold"
                    >{{ evaluation.criteria[key] }}/10</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-600 h-2.5 rounded-full"
                    :style="{
                      width: `${(evaluation.criteria[key] / 10) * 100}%`,
                    }"
                  ></div>
                </div>
              </div>

              <!-- Individual-specific Criteria (show only for individual projects) -->
              <template v-if="project && !project.isGroupProject">
                <div class="md:col-span-2 mt-4">
                  <h4 class="text-base font-medium text-gray-700 mb-2">
                    Individual Skills
                  </h4>
                </div>

                <div
                  v-for="key in [
                    'communication',
                    'projectManagement',
                    'adaptability',
                  ]"
                  :key="key"
                  class="bg-gray-50 p-4 rounded"
                  v-if="
                    evaluation.criteria &&
                    evaluation.criteria[key] !== undefined
                  "
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-medium text-gray-700">{{
                      formatCriteriaKey(key)
                    }}</span>
                    <span class="text-sm font-bold"
                      >{{ evaluation.criteria[key] }}/10</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-blue-600 h-2.5 rounded-full"
                      :style="{
                        width: `${(evaluation.criteria[key] / 10) * 100}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </template>

              <!-- Group-specific Criteria (show only for group projects) -->
              <template v-if="project && project.isGroupProject">
                <div class="md:col-span-2 mt-4">
                  <h4 class="text-base font-medium text-gray-700 mb-2">
                    Team Collaboration Skills
                  </h4>
                </div>

                <div
                  v-for="key in [
                    'teamwork',
                    'collaboration',
                    'rolePerformance',
                    'conflictResolution',
                    'leadershipContribution',
                  ]"
                  :key="key"
                  class="bg-gray-50 p-4 rounded"
                  v-if="
                    evaluation.criteria &&
                    evaluation.criteria[key] !== undefined
                  "
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-medium text-gray-700">{{
                      formatCriteriaKey(key)
                    }}</span>
                    <span class="text-sm font-bold"
                      >{{ evaluation.criteria[key] }}/10</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-blue-600 h-2.5 rounded-full"
                      :style="{
                        width: `${(evaluation.criteria[key] / 10) * 100}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Detailed Analysis -->
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Detailed Analysis</h3>
            <div class="prose max-w-none">
              <div v-if="deliverableAnalysis">
                <h4 class="text-md font-medium mb-2">
                  Last Submission Analysis
                </h4>
                <div class="text-gray-700 mb-4">
                  {{ deliverableAnalysis.analysis }}
                </div>

                <h4 class="text-md font-medium mb-2">Key Achievements</h4>
                <ul class="list-disc pl-5 mb-4">
                  <li
                    v-for="(
                      achievement, index
                    ) in deliverableAnalysis.achievements"
                    :key="index"
                    class="mb-1"
                  >
                    {{ achievement }}
                  </li>
                </ul>

                <h4 class="text-md font-medium mb-2">Areas for Improvement</h4>
                <ul class="list-disc pl-5">
                  <li
                    v-for="(
                      area, index
                    ) in deliverableAnalysis.improvementAreas"
                    :key="index"
                    class="mb-1"
                  >
                    {{ area }}
                  </li>
                </ul>
              </div>
              <div v-else class="text-gray-500 italic">
                No detailed analysis available yet. Submit a milestone to
                receive feedback.
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Sidebar with AI recommendations and progress -->
        <div class="lg:col-span-1">
          <!-- Evaluation Summary Card -->
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Evaluation Summary</h3>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="border-r border-gray-200 pr-4">
                <div class="text-sm text-gray-600 mb-1">Evaluation Date</div>
                <div class="font-medium">
                  {{ formatDate(evaluation.updatedAt) }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600 mb-1">Evaluator</div>
                <div class="font-medium">
                  {{
                    evaluation.evaluator || project.agent?.name || "System AI"
                  }}
                </div>
              </div>
            </div>

            <!-- Add status badge -->
            <div class="mb-4">
              <span
                :class="
                  evaluation.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                "
                class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ formatText(evaluation.status) }}
              </span>
            </div>

            <!-- Member Contributions for Group Projects -->
            <div
              v-if="
                project &&
                project.isGroupProject &&
                evaluation.memberContributions &&
                Object.keys(evaluation.memberContributions).length > 0
              "
              class="mb-6 border-t border-gray-200 pt-4 mt-4"
            >
              <h4 class="text-base font-medium text-gray-700 mb-3">
                Individual Contributions
              </h4>

              <div class="space-y-3">
                <div
                  v-for="(
                    contribution, memberId
                  ) in evaluation.memberContributions"
                  :key="memberId"
                  class="border border-gray-200 rounded-lg p-3"
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-medium">
                      {{ getMemberName(memberId) }}
                    </span>
                    <span class="text-sm font-bold text-blue-600">
                      {{ contribution.contribution }}% Contribution
                    </span>
                  </div>

                  <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      class="bg-blue-600 h-2.5 rounded-full"
                      :style="{ width: `${contribution.contribution}%` }"
                    ></div>
                  </div>

                  <p
                    v-if="contribution.notes"
                    class="text-sm text-gray-600 mt-2"
                  >
                    {{ contribution.notes }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="evaluation.recommendationsForImprovement" class="mb-4">
              <h4 class="text-base font-medium text-gray-700 mb-2">
                Recommendations
              </h4>
              <p class="text-gray-600 whitespace-pre-line">
                {{ evaluation.recommendationsForImprovement }}
              </p>
            </div>
          </div>

          <!-- AI Agent Recommendations -->
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">AI Recommendations</h3>
            <div v-if="evaluation.recommendationsForImprovement" class="mb-4">
              <div class="text-gray-700 mb-4">
                {{ evaluation.recommendationsForImprovement }}
              </div>

              <div v-if="nextSteps.length > 0">
                <h4 class="text-md font-medium mb-2">Suggested Next Steps</h4>
                <ul class="list-disc pl-5">
                  <li
                    v-for="(step, index) in nextSteps"
                    :key="index"
                    class="mb-2 text-gray-700"
                  >
                    {{ step }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-else>
              <p class="text-gray-500 italic">
                Recommendations will be generated when the evaluation is
                complete.
              </p>
              <button
                v-if="
                  authStore.isProfessor && evaluation.status !== 'completed'
                "
                @click="generateRecommendations"
                class="btn btn-primary mt-4"
                :disabled="isGeneratingRecommendations"
              >
                {{
                  isGeneratingRecommendations
                    ? "Generating..."
                    : "Generate Recommendations"
                }}
              </button>
            </div>
          </div>

          <!-- Timeline Progress -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Project Timeline</h3>
            <div
              v-if="milestones.length > 0"
              class="relative border-l-2 border-gray-200 ml-3"
            >
              <div
                v-for="(milestone, index) in milestones"
                :key="milestone.id"
                class="mb-6 ml-6"
              >
                <!-- Status dot -->
                <div
                  class="absolute w-4 h-4 rounded-full -left-2"
                  :class="getMilestoneStatusClass(milestone.status)"
                ></div>
                <div class="text-sm font-medium">{{ milestone.title }}</div>
                <div class="text-xs text-gray-500 mb-1">
                  Due: {{ formatDate(milestone.dueDate) }}
                </div>
                <div
                  class="text-xs inline-block px-2 py-1 rounded"
                  :class="getMilestoneStatusTextClass(milestone.status)"
                >
                  {{ formatText(milestone.status) }}
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 italic">
              No milestones have been defined for this project.
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppLayout from "@/components/AppLayout.vue";
import ReportDownloader from "@/components/ReportDownloader.vue";
import Chart from "chart.js/auto";
import apiService from "@/services/api";
import type { Evaluation, Project } from "@/types";

const { projectService, evaluationService, milestoneService, agentService } =
  apiService;

const route = useRoute();
const authStore = useAuthStore();
const projectId = ref(route.params.id as string);
const isLoading = ref(true);
const isGeneratingRecommendations = ref(false);
const project = ref<Project | null>(null);
const evaluation = ref({
  id: "",
  criteria: {
    technicalSkills: 0,
    problemSolving: 0,
    communication: 0,
    teamwork: 0,
    creativity: 0,
    deliveryQuality: 0,
    projectManagement: 0,
    adaptability: 0,
  },
  comments: "",
  recommendationsForImprovement: "",
  status: "draft",
  createdAt: new Date(),
  updatedAt: new Date(),
  evaluator: "",
});
const milestones = ref([]);
const nextSteps = ref([]);
const deliverableAnalysis = ref(null);
const radarChart = ref(null);
const chartContainer = ref(null);
const radarChartInstance = ref(null);

onMounted(async () => {
  try {
    await Promise.all([fetchProject(), fetchEvaluation(), fetchMilestones()]);
    if (project.value?.agentId) {
      await fetchNextSteps();
    }
    if (evaluation.value.id) {
      await fetchDeliverableAnalysis();
    }
    initChart();
  } catch (error) {
    console.error("Error loading evaluation data:", error);
  } finally {
    isLoading.value = false;
  }
});

const fetchProject = async () => {
  try {
    const response = await projectService.getProject(projectId.value);
    project.value = response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    // Mock data for development
    project.value = {
      id: projectId.value,
      title: "Sample Project",
      description: "This is a sample project for development",
      status: "in_progress",
      createdAt: new Date(),
      updatedAt: new Date(),
      agentId: "sample-agent-id",
      agent: {
        id: "sample-agent-id",
        name: "Sample Agent",
        description: "This is a sample agent for development",
        personality: "analytical",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }
};

const fetchEvaluation = async () => {
  try {
    // Attempt to fetch the latest evaluation for this project
    const response = await evaluationService.getEvaluations(projectId.value);
    if (response.data && response.data.length > 0) {
      // Sort by date and get the most recent
      const sortedEvaluations = response.data.sort(
        (a: Evaluation, b: Evaluation) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      evaluation.value = sortedEvaluations[0];
    }
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    // Create mock data for development
    evaluation.value = {
      id: "sample-evaluation-id",
      criteria: {
        technicalSkills: 7,
        problemSolving: 8,
        communication: 6,
        teamwork: 9,
        creativity: 7,
        deliveryQuality: 8,
        projectManagement: 6,
        adaptability: 8,
      },
      comments: "The team has shown good progress in most areas.",
      recommendationsForImprovement:
        "Focus on improving communication and project management skills.",
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
      evaluator: "AI Evaluation System",
    };
  }
};

const fetchMilestones = async () => {
  try {
    const response = await milestoneService.getMilestones(projectId.value);
    milestones.value = response.data;
  } catch (error) {
    console.error("Error fetching milestones:", error);
    // Mock data for development
    milestones.value = [
      {
        id: "milestone-1",
        title: "Project Planning",
        description: "Initial project plan and requirements",
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        status: "approved",
      },
      {
        id: "milestone-2",
        title: "Design Phase",
        description: "UI/UX design and architecture",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: "submitted",
      },
      {
        id: "milestone-3",
        title: "MVP Implementation",
        description: "Core functionality implementation",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in future
        status: "pending",
      },
    ];
  }
};

const fetchNextSteps = async () => {
  try {
    const response = await agentService.getNextSteps(
      project.value.agentId,
      projectId.value
    );
    nextSteps.value = response.data.steps;
  } catch (error) {
    console.error("Error fetching next steps:", error);
    // Mock data for development
    nextSteps.value = [
      "Focus on improving the API response time by implementing caching",
      "Add more comprehensive test coverage for edge cases",
      "Refactor the authentication flow to improve security",
      "Document the core functionality to facilitate onboarding",
    ];
  }
};

const fetchDeliverableAnalysis = async () => {
  try {
    // In a real implementation, this would call a backend endpoint to analyze deliverables
    // For now, we'll simulate it with mock data
    // Simulating API call and response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    deliverableAnalysis.value = {
      analysis:
        "The team has demonstrated a solid understanding of the technical requirements. The code is well-structured with good use of design patterns. However, there are areas where error handling and edge cases could be improved.",
      achievements: [
        "Implemented core functionality with clean architecture",
        "Good test coverage for primary user flows",
        "Effective use of the Strategy pattern for agent personality types",
        "Clear documentation for primary API endpoints",
      ],
      improvementAreas: [
        "Error handling needs to be more robust in API interactions",
        "Some UI components have accessibility issues",
        "Project documentation is incomplete in some advanced areas",
        "Performance optimizations needed for large data sets",
      ],
    };
  } catch (error) {
    console.error("Error fetching deliverable analysis:", error);
    // Leave as null if there's an error
  }
};

const generateRecommendations = async () => {
  isGeneratingRecommendations.value = true;
  try {
    // In a real implementation, this would call the backend to generate recommendations
    // based on the agent's personality and the evaluation data
    if (project.value?.agentId) {
      const mockRecommendations =
        "To improve performance, focus on enhancing communication between team members and establishing clearer project management practices. Consider implementing daily stand-ups and using more collaborative tools.";

      // Update the evaluation with the new recommendations
      const updatedEvaluation = {
        ...evaluation.value,
        recommendationsForImprovement: mockRecommendations,
      };

      // In a real implementation, this would save to the backend:
      // await evaluationService.updateEvaluation(
      //   projectId.value,
      //   evaluation.value.id,
      //   updatedEvaluation
      // );

      // Update local state
      evaluation.value.recommendationsForImprovement = mockRecommendations;

      // Fetch fresh next steps based on the new recommendations
      await fetchNextSteps();
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    alert("Failed to generate recommendations. Please try again.");
  } finally {
    isGeneratingRecommendations.value = false;
  }
};

const initChart = () => {
  const ctx = radarChart.value.getContext("2d");

  // If there's an existing chart, destroy it first
  if (radarChartInstance.value) {
    radarChartInstance.value.destroy();
  }

  // Extract criteria data from the evaluation based on project type
  let criteriaToDisplay = {};

  // Common criteria for both types
  const commonCriteria = [
    "technicalSkills",
    "problemSolving",
    "creativity",
    "deliveryQuality",
  ];

  // Individual-specific criteria
  const individualCriteria = [
    "communication",
    "projectManagement",
    "adaptability",
  ];

  // Group-specific criteria
  const groupCriteria = [
    "teamwork",
    "collaboration",
    "rolePerformance",
    "conflictResolution",
    "leadershipContribution",
  ];

  // Filter criteria to display based on project type
  const isGroupProject = project.value?.isGroupProject || false;
  const criteriaSet = [
    ...commonCriteria,
    ...(isGroupProject ? groupCriteria : individualCriteria),
  ];

  // Filter evaluation criteria to only include the relevant fields
  for (const key of criteriaSet) {
    if (
      evaluation.value.criteria &&
      evaluation.value.criteria[key] !== undefined
    ) {
      criteriaToDisplay[key] = evaluation.value.criteria[key];
    }
  }

  const labels = Object.keys(criteriaToDisplay).map((key) =>
    formatCriteriaKey(key)
  );
  const data = Object.values(criteriaToDisplay);

  radarChartInstance.value = new Chart(ctx, {
    type: "radar",
    data: {
      labels: labels,
      datasets: [
        {
          label: isGroupProject
            ? "Group Performance"
            : "Individual Performance",
          data: data,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgba(59, 130, 246, 1)",
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(59, 130, 246, 1)",
        },
      ],
    },
    options: {
      scales: {
        r: {
          angleLines: {
            display: true,
          },
          suggestedMin: 0,
          suggestedMax: 10,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function (context) {
              return `Score: ${context.formattedValue}/10`;
            },
          },
        },
      },
    },
  });
};

const calculateOverallScore = () => {
  if (!evaluation.value.criteria) return 0;

  const values = Object.values(evaluation.value.criteria);
  if (values.length === 0) return 0;

  const sum = values.reduce((total, value) => total + value, 0);
  return (sum / values.length).toFixed(1);
};

const formatCriteriaKey = (key) => {
  if (!key) return "";

  // Special handling for certain keys
  const specialFormats = {
    rolePerformance: "Role Performance",
    leadershipContribution: "Leadership & Contribution",
  };

  if (specialFormats[key]) {
    return specialFormats[key];
  }

  // General formatting for other keys
  return key
    .replace(/([A-Z])/g, " $1") // Insert a space before all capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Uppercase the first character
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

const formatText = (text) => {
  if (!text) return "";
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return classes[status] || "bg-gray-100 text-gray-800";
};

const getMilestoneStatusClass = (status) => {
  const classes = {
    pending: "bg-gray-300",
    submitted: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    overdue: "bg-red-300",
  };

  return classes[status] || "bg-gray-300";
};

const getMilestoneStatusTextClass = (status) => {
  const classes = {
    pending: "bg-gray-100 text-gray-800",
    submitted: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    overdue: "bg-red-100 text-red-800",
  };

  return classes[status] || "bg-gray-100 text-gray-800";
};

const getMemberName = (memberId) => {
  // Check if we have the project group loaded with members
  if (project.value?.group?.members) {
    const member = project.value.group.members.find((m) => m.id === memberId);
    if (member) {
      return `${member.firstName} ${member.lastName}`;
    }
  }

  // Fallback for cases where member data isn't available
  return `Team Member (${memberId.substring(0, 8)})`;
};
</script>
