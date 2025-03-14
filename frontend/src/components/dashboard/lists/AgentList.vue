<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <div
      v-for="agent in agents"
      :key="agent.id"
      class="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <!-- Agent Header with Personality Color -->
      <div
        class="p-4 border-b"
        :class="{
          'bg-accent-500 text-white': agent.personality === 'analytical',
          'bg-danger-500 text-white': agent.personality === 'demanding',
          'bg-success-500 text-white': agent.personality === 'supportive',
          'bg-purple-500 text-white': agent.personality === 'creative',
          'bg-warning-500 text-white': agent.personality === 'challenging',
        }"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold mb-0">{{ agent.name }}</h3>
          <span
            class="badge text-xs font-semibold uppercase border border-white/30 text-white"
          >
            {{ agent.personality }}
          </span>
        </div>
      </div>

      <!-- Agent Content -->
      <div class="p-5">
        <p class="text-neutral-600 mb-4 line-clamp-3">
          {{ agent.description }}
        </p>
        <div class="flex items-center justify-between">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
          >
            {{ agent.problemCategory }}
          </span>
          <button
            @click="onStartProject(agent.id)"
            class="btn btn-primary py-1.5 px-3 text-sm"
          >
            Start Project
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Agent {
  id: string;
  name: string;
  personality: string;
  description: string;
  problemCategory: string;
  type?: string;
  model?: string;
}

interface Props {
  agents: Agent[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "startProject", agentId: string): void;
}>();

function onStartProject(agentId: string) {
  emit("startProject", agentId);
}
</script>
