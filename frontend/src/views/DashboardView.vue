<template>
  <AppLayout>
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p class="text-neutral-600 text-lg">
          Welcome back, {{ authStore.user?.firstName }}
        </p>
      </div>

      <!-- Student View -->
      <StudentDashboard
        v-if="authStore.isStudent"
        :projects="studentProjects"
        :loading="isLoading"
        :userId="authStore.user?.id || ''"
        :useMockData="useMockData"
        @startNewProject="startNewProject()"
      />

      <!-- Professor View -->
      <ProfessorDashboard
        v-else-if="authStore.isProfessor"
        :projects="professorProjects"
        :loading="isLoading"
      />

      <!-- Admin View -->
      <AdminDashboard
        v-else-if="authStore.isAdmin"
        @generateReports="generateReports"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiService from "@/services/api";
import AppLayout from "@/components/layout/AppLayout.vue";
import StudentDashboard from "@/components/dashboard/views/StudentDashboard.vue";
import ProfessorDashboard from "@/components/dashboard/views/ProfessorDashboard.vue";
import AdminDashboard from "@/components/dashboard/views/AdminDashboard.vue";

const { projectService } = apiService;

const router = useRouter();
const authStore = useAuthStore();
const useMockData = ref(true); // Set to true to use mock data

interface Project {
  id: string;
  title: string;
  status: string;
  agent?: {
    name: string;
  };
  student?: {
    firstName: string;
    lastName: string;
  };
  endDate: Date;
  createdBy?: string;
  group?: string;
}

const isLoading = ref(true);
const studentProjects = ref<Project[]>([]);
const professorProjects = ref<Project[]>([]);

onMounted(async () => {
  try {
    isLoading.value = true;

    // Load appropriate data based on user role
    if (authStore.isStudent) {
      if (!useMockData.value) {
        await fetchStudentProjects();
      } else {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } else if (authStore.isProfessor) {
      await fetchProfessorProjects();
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
});

async function fetchStudentProjects() {
  try {
    const response = await projectService.getProjects();
    studentProjects.value = response.data;
  } catch (error) {
    console.error("Error fetching student projects:", error);
    // For demo purposes, populate with mock data
    studentProjects.value = [
      {
        id: "1",
        title: "Automation System for Inventory Management",
        status: "in_progress",
        agent: { name: "Business Automation Agent" },
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        title: "Social Media Analytics Dashboard",
        status: "completed",
        agent: { name: "Data Analytics Agent" },
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }
}

async function fetchProfessorProjects() {
  try {
    const response = await projectService.getAllProjects();
    professorProjects.value = response.data;
  } catch (error) {
    console.error("Error fetching professor projects:", error);
    // For demo purposes, populate with mock data
    professorProjects.value = [
      {
        id: "1",
        title: "Automation System for Inventory Management",
        status: "in_progress",
        student: { firstName: "Alex", lastName: "Johnson" },
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        title: "Social Media Analytics Dashboard",
        status: "completed",
        student: { firstName: "Sam", lastName: "Wilson" },
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3",
        title: "E-Commerce Website Redesign",
        status: "pending",
        student: { firstName: "Taylor", lastName: "Smith" },
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];
  }
}

function startNewProject() {
  router.push("/projects/create");
}

function generateReports() {
  alert("Generating reports...");
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f0f2f5;
}
</style>
