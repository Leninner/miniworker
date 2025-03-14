<template>
  <div v-if="courseStore.loading" class="flex justify-center items-center h-64">
    <div class="spinner"></div>
  </div>
  <div v-else-if="!course" class="text-center py-12">
    <h2 class="text-2xl font-bold text-neutral-900 mb-2">Course not found</h2>
    <p class="text-neutral-500">
      The course you're looking for doesn't exist or you don't have access to
      it.
    </p>
    <router-link
      to="/dashboard"
      class="mt-4 inline-block text-accent-600 hover:text-accent-800"
    >
      Return to Dashboard
    </router-link>
  </div>
  <div v-else class="space-y-8">
    <!-- Course Header -->
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <div class="px-6 py-5 sm:px-8">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-neutral-900 mb-1">
                {{ course.name }}
              </h1>
              <span
                class="ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': isActive,
                  'bg-red-100 text-red-800': !isActive,
                }"
              >
                {{ isActive ? "Active" : "Inactive" }}
              </span>
            </div>
            <p class="text-sm text-neutral-500 mb-2">{{ course.code }}</p>
            <p class="text-neutral-700">{{ course.description }}</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="showEditCourseForm = true"
              class="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              Edit Course
            </button>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <h3 class="text-sm font-medium text-neutral-500">Start Date</h3>
            <p class="mt-1 text-sm text-neutral-900">
              {{ formatDate(course.startDate) }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-neutral-500">End Date</h3>
            <p class="mt-1 text-sm text-neutral-900">
              {{ formatDate(course.endDate) }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-neutral-500">Students</h3>
            <p class="mt-1 text-sm text-neutral-900">
              {{ course.students?.length || 0 }} enrolled
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Code Section -->
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <div class="px-6 py-5 sm:px-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-neutral-900">
            Course Enrollment QR Code
          </h2>
          <button
            @click="generateQRCode"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            Generate New QR Code
          </button>
        </div>
        <div class="p-4 flex flex-col items-center">
          <div v-if="courseStore.loading" class="flex justify-center mb-4">
            <div class="spinner"></div>
          </div>
          <div v-else-if="qrCode" class="qr-code-container mb-4">
            <img
              :src="qrCode.url"
              alt="Course enrollment QR code"
              class="w-64 h-64"
            />
            <p class="text-sm text-neutral-500 mt-2">
              QR Code expires: {{ formatDate(qrCode.expiresAt) }}
            </p>
          </div>
          <div v-else class="text-center p-4">
            <p class="text-neutral-600">
              No QR code generated yet. Click the button above to generate one.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Students Section -->
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <div class="px-6 py-5 sm:px-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-neutral-900">
            Enrolled Students
          </h2>
          <div class="flex space-x-3">
            <button
              @click="showAddStudentForm = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              Add Student
            </button>
          </div>
        </div>
        <StudentList :students="formattedStudents" @remove="removeStudent" />
      </div>
    </div>

    <!-- Groups Section -->
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <div class="px-6 py-5 sm:px-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-neutral-900">Course Groups</h2>
          <div class="flex space-x-3">
            <button
              @click="openGroupForm()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              Create Group
            </button>
          </div>
        </div>
        <GroupList
          :groups="groups"
          @edit="openGroupForm"
          @delete="deleteGroup"
        />
      </div>
    </div>
  </div>

  <!-- Course Edit Form Modal -->
  <div v-if="showEditCourseForm" class="fixed inset-0 z-10 overflow-y-auto">
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
          :course="courseFormData"
          :isEditing="true"
          @submit="handleCourseUpdate"
          @cancel="showEditCourseForm = false"
        />
      </div>
    </div>
  </div>

  <!-- Add Student Form Modal -->
  <div v-if="showAddStudentForm" class="fixed inset-0 z-10 overflow-y-auto">
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
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3
                class="text-lg leading-6 font-medium text-neutral-900"
                id="modal-title"
              >
                Add Student to Course
              </h3>
              <div class="mt-4">
                <label
                  for="studentEmail"
                  class="block text-sm font-medium text-neutral-700"
                >
                  Student Email
                </label>
                <div class="mt-1">
                  <input
                    type="email"
                    name="studentEmail"
                    id="studentEmail"
                    v-model="studentEmail"
                    class="shadow-sm focus:ring-accent-500 focus:border-accent-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                    placeholder="student@example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
        >
          <button
            type="button"
            @click="addStudent"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-accent-600 text-base font-medium text-white hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Add Student
          </button>
          <button
            type="button"
            @click="showAddStudentForm = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Group Form Modal -->
  <div v-if="showGroupForm" class="fixed inset-0 z-10 overflow-y-auto">
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
        <GroupForm
          :group="formattedSelectedGroup"
          :availableStudents="formattedStudents"
          :currentStudentIds="selectedStudentIds"
          :isEditing="!!selectedGroup"
          @submit="handleGroupSubmit"
          @cancel="closeGroupForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "@/stores/course";
import StudentList from "../lists/StudentList.vue";
import GroupList from "../lists/GroupList.vue";
import CourseForm from "../forms/CourseForm.vue";
import GroupForm from "../forms/GroupForm.vue";
import type { Course, CourseGroup, CourseQRCode as QRCodeType } from "@/types";

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

// Interface for the StudentList component
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  group?: {
    id: string;
    name: string;
  };
}

// Interface for the GroupList component
interface Group {
  id: string;
  name: string;
  description: string;
  students: Student[];
}

// Interface for the GroupForm component
interface GroupFormData {
  id?: string;
  name: string;
  description: string;
  studentIds?: string[];
}

const route = useRoute();
const courseStore = useCourseStore();
const courseId = route.params.id as string;

// Course data
const course = computed(() => courseStore.selectedCourse);
const isActive = computed(() => {
  if (!course.value) return false;
  return new Date(course.value.endDate) >= new Date();
});

// QR Code
const qrCode = computed(() => courseStore.qrCode);

// Students
const studentEmail = ref("");
const showAddStudentForm = ref(false);

// Format students for the StudentList component
const formattedStudents = computed<Student[]>(() => {
  if (!course.value || !course.value.students) return [];

  return course.value.students.map((student) => ({
    id: student.id,
    firstName: student.name.split(" ")[0] || "",
    lastName: student.name.split(" ").slice(1).join(" ") || "",
    email: student.email,
    active: true,
    group: getStudentGroup(student.id),
  }));
});

// Groups
const groups = ref<Group[]>([]);
const showGroupForm = ref(false);
const selectedGroup = ref<Group | undefined>(undefined);
const selectedStudentIds = ref<string[]>([]);

// Format selected group for the GroupForm component
const formattedSelectedGroup = computed<GroupFormData | undefined>(() => {
  if (!selectedGroup.value) return undefined;

  return {
    id: selectedGroup.value.id,
    name: selectedGroup.value.name,
    description: selectedGroup.value.description,
  };
});

// Course form
const showEditCourseForm = ref(false);
const courseFormData = computed<CourseFormData>(() => {
  if (!course.value)
    return {
      name: "",
      code: "",
      description: "",
      active: true,
      startDate: "",
      endDate: "",
    };

  return {
    id: course.value.id,
    name: course.value.name,
    code: course.value.code,
    description: course.value.description,
    active: isActive.value,
    startDate:
      course.value.startDate instanceof Date
        ? course.value.startDate.toISOString().split("T")[0]
        : new Date(course.value.startDate).toISOString().split("T")[0],
    endDate:
      course.value.endDate instanceof Date
        ? course.value.endDate.toISOString().split("T")[0]
        : new Date(course.value.endDate).toISOString().split("T")[0],
    studentCount: course.value.students?.length || 0,
  };
});

onMounted(async () => {
  // Fetch course details
  await courseStore.fetchCourse(courseId);

  // Fetch course groups
  await courseStore.fetchCourseGroups(courseId);

  // Format groups
  updateGroupsFromStore();
});

// Watch for changes in the course groups
watch(
  () => courseStore.courseGroups,
  () => {
    updateGroupsFromStore();
  }
);

function updateGroupsFromStore() {
  groups.value = courseStore.courseGroups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description || "",
    students: getStudentsInGroup(group.id),
  }));
}

function getStudentsInGroup(groupId: string): Student[] {
  return formattedStudents.value.filter(
    (student) => student.group?.id === groupId
  );
}

function getStudentGroup(studentId: string) {
  // Find the group that contains this student
  const group = courseStore.courseGroups.find((group) =>
    group.students?.some((student) => student.id === studentId)
  );

  if (group) {
    return {
      id: group.id,
      name: group.name,
    };
  }

  return undefined;
}

function formatDate(date: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
}

async function generateQRCode() {
  await courseStore.getQRCode(courseId);
}

async function handleCourseUpdate(formData: CourseFormData) {
  // Convert string dates to Date objects for the API
  const apiCourseData = {
    name: formData.name,
    code: formData.code,
    description: formData.description,
    startDate: new Date(formData.startDate),
    endDate: new Date(formData.endDate),
  };

  await courseStore.updateCourse(courseId, apiCourseData);
  showEditCourseForm.value = false;
}

async function addStudent() {
  if (!studentEmail.value) return;

  // In a real implementation, you would search for the student by email
  // and then enroll them in the course
  // For now, we'll just show an alert
  alert(
    `Student with email ${studentEmail.value} would be added to the course`
  );

  studentEmail.value = "";
  showAddStudentForm.value = false;
}

async function removeStudent(studentId: string) {
  await courseStore.removeStudent(courseId, studentId);
}

function openGroupForm(group?: Group) {
  selectedGroup.value = group;

  if (group) {
    // If editing an existing group, pre-select its students
    selectedStudentIds.value = getStudentIdsInGroup(group.id);
  } else {
    // If creating a new group, no students are pre-selected
    selectedStudentIds.value = [];
  }

  showGroupForm.value = true;
}

async function deleteGroup(groupId: string) {
  await courseStore.deleteGroup(groupId);
}

async function handleGroupSubmit(data: {
  group: GroupFormData;
  studentIds: string[];
}) {
  const { group, studentIds } = data;

  if (selectedGroup.value) {
    // Update existing group
    const groupData = {
      name: group.name,
      description: group.description,
      courseId,
    };

    await courseStore.updateGroup(selectedGroup.value.id, groupData);

    // Update students in the group
    // This would require additional API calls in a real implementation
  } else {
    // Create new group
    const groupData = {
      name: group.name,
      description: group.description,
      courseId,
    };

    await courseStore.createGroup(groupData);
  }

  closeGroupForm();
}

function getStudentIdsInGroup(groupId: string): string[] {
  return formattedStudents.value
    .filter((student) => student.group?.id === groupId)
    .map((student) => student.id);
}

function closeGroupForm() {
  showGroupForm.value = false;
  selectedGroup.value = undefined;
  selectedStudentIds.value = [];
}
</script>
