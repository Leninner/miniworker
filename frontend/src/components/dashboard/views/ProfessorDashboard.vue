<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="md:col-span-2">
      <DashboardCard
        title="Courses"
        subtitle="Manage your courses and student enrollments"
        :loading="courseStore.loading"
        :isEmpty="professorCourses.length === 0"
        emptyMessage="No courses available."
        emptyDescription="Create a course to get started."
      >
        <template #actions>
          <button @click="showCourseForm = true" class="btn btn-primary">
            Create Course
          </button>
        </template>

        <CourseList :courses="formattedCourses" />
      </DashboardCard>
    </div>

    <div class="md:col-span-2">
      <DashboardCard
        title="Student Projects"
        subtitle="Monitor and evaluate your students' projects"
        :loading="loading"
        :isEmpty="projects.length === 0"
        emptyMessage="No student projects available."
        emptyDescription="Create some agents to allow students to start projects."
      >
        <ProjectList :projects="projects" :showStudent="true" />
      </DashboardCard>
    </div>
  </div>

  <!-- Course Form Modal -->
  <div v-if="showCourseForm" class="fixed inset-0 z-10 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-neutral-500 opacity-75"></div>
      </div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <CourseForm
          :course="selectedCourseForForm"
          :isEditing="!!selectedCourse"
          @submit="handleCourseSubmit"
          @cancel="closeCourseForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useCourseStore } from "@/stores/course";
import DashboardCard from "../../dashboard/cards/DashboardCard.vue";
import ProjectList from "../../dashboard/lists/ProjectList.vue";
import CourseList from "../../dashboard/lists/CourseList.vue";
import CourseForm from "../../dashboard/forms/CourseForm.vue";
import type { Course } from "@/types";

interface Project {
  id: string;
  title: string;
  status: string;
  student?: {
    firstName: string;
    lastName: string;
  };
  endDate: Date;
}

// Interface for the CourseList component
interface CourseListItem {
  id: string;
  name: string;
  code: string;
  active: boolean;
  studentCount: number;
}

// Interface for the CourseForm component
interface CourseFormData {
  id?: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  startDate: string;
  endDate: string;
  studentCount?: number;
}

interface Props {
  projects: Project[];
  loading: boolean;
}

const props = defineProps<Props>();
const courseStore = useCourseStore();

// Course management
const showCourseForm = ref(false);
const selectedCourse = ref<Course | undefined>(undefined);

// Get professor courses from the store
const professorCourses = computed(() => courseStore.professorCourses);

// Format courses for the CourseList component
const formattedCourses = computed<CourseListItem[]>(() => {
  return professorCourses.value.map((course) => ({
    id: course.id,
    name: course.name,
    code: course.code,
    active: new Date(course.endDate) >= new Date(),
    studentCount: course.students?.length || 0,
  }));
});

// Format selected course for the CourseForm component
const selectedCourseForForm = computed<CourseFormData | undefined>(() => {
  if (!selectedCourse.value) return undefined;

  return {
    id: selectedCourse.value.id,
    name: selectedCourse.value.name,
    code: selectedCourse.value.code,
    description: selectedCourse.value.description,
    active: new Date(selectedCourse.value.endDate) >= new Date(),
    startDate:
      selectedCourse.value.startDate instanceof Date
        ? selectedCourse.value.startDate.toISOString().split("T")[0]
        : new Date(selectedCourse.value.startDate).toISOString().split("T")[0],
    endDate:
      selectedCourse.value.endDate instanceof Date
        ? selectedCourse.value.endDate.toISOString().split("T")[0]
        : new Date(selectedCourse.value.endDate).toISOString().split("T")[0],
    studentCount: selectedCourse.value.students?.length || 0,
  };
});

onMounted(async () => {
  // Fetch courses from API
  await courseStore.fetchCourses();
});

async function handleCourseSubmit(formData: CourseFormData) {
  // Convert string dates to Date objects for the API
  const apiCourseData = {
    name: formData.name,
    code: formData.code,
    description: formData.description,
    startDate: new Date(formData.startDate),
    endDate: new Date(formData.endDate),
  };

  if (selectedCourse.value) {
    // Update existing course
    await courseStore.updateCourse(selectedCourse.value.id, apiCourseData);
  } else {
    // Create new course
    await courseStore.createCourse(apiCourseData);
  }

  closeCourseForm();
}

function closeCourseForm() {
  showCourseForm.value = false;
  selectedCourse.value = undefined;
}
</script>
