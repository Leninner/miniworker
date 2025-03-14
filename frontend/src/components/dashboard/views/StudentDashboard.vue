<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- My Projects -->
    <div class="md:col-span-2">
      <DashboardCard
        title="My Projects"
        subtitle="Your current and completed projects"
        :loading="loading"
        :isEmpty="projects.length === 0"
        emptyMessage="You don't have any projects yet."
        emptyDescription="Start a new project with an AI agent to begin working on real-world problems."
      >
        <template #actions>
          <button class="btn btn-primary" @click="$emit('startNewProject')">
            Start New Project
          </button>
        </template>

        <ProjectList :projects="projects" :showAgent="true" />
      </DashboardCard>
    </div>

    <!-- Student Performance Report -->
    <div>
      <DashboardCard
        title="Performance Report"
        subtitle="Track your progress and get insights on your performance"
      >
        <div class="px-6 py-8 sm:px-8">
          <ReportDownloader entityType="student" :entityId="userId" />
        </div>
      </DashboardCard>
    </div>

    <!-- Available Agents -->
    <div class="md:col-span-3">
      <DashboardCard
        title="Available Agents"
        subtitle="Start a new project with one of these agents"
        :loading="loading"
        :isEmpty="agents.length === 0"
        emptyMessage="No agents are available at the moment."
        emptyDescription="Please check back later or contact your professor."
      >
        <AgentList :agents="agents" @startProject="onStartProject" />
      </DashboardCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import DashboardCard from "../../dashboard/cards/DashboardCard.vue";
import ProjectList from "../../dashboard/lists/ProjectList.vue";
import AgentList from "../../dashboard/lists/AgentList.vue";
import ReportDownloader from "../../ReportDownloader.vue";

interface Project {
  id: string;
  title: string;
  status: string;
  agent?: {
    name: string;
  };
  endDate: Date;
}

interface Agent {
  id: string;
  name: string;
  personality: string;
  description: string;
  problemCategory: string;
}

interface Props {
  projects: Project[];
  agents: Agent[];
  loading: boolean;
  userId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "startNewProject"): void;
  (e: "startProject", agentId: string): void;
}>();

function onStartProject(agentId: string) {
  emit("startProject", agentId);
}
</script>
