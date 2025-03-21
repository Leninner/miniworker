<template>
  <div class="bg-white shadow overflow-hidden rounded-lg">
    <div class="px-6 py-5 sm:px-8 border-b border-neutral-200">
      <h2 class="text-xl font-bold text-neutral-900 mb-1">
        {{ isEditing ? "Edit Course" : "Create New Course" }}
      </h2>
      <p class="text-sm text-neutral-500 mb-0">
        {{
          isEditing
            ? "Update course details"
            : "Add a new course for your students"
        }}
      </p>
    </div>
    <div class="p-6 sm:p-8">
      <Form @submit="handleSubmit">
        <div class="space-y-6">
          <FormInput
            id="name"
            name="name"
            label="Course Name"
            v-model="form.name"
            required
            placeholder="e.g. Introduction to Computer Science"
            help-text="The name of the course is required"
          />

          <FormTextarea
            id="description"
            name="description"
            label="Description"
            v-model="form.description"
            :rows="3"
            placeholder="Provide a brief description of the course"
            help-text="Optional: Add details about the course content and objectives"
          />

          <FormGroup :columns="2">
            <FormInput
              id="startDate"
              name="startDate"
              label="Start Date"
              type="date"
              v-model="form.startDate"
              required
              help-text="When does the course begin?"
            />

            <FormInput
              id="endDate"
              name="endDate"
              label="End Date"
              type="date"
              v-model="form.endDate"
              required
              help-text="When does the course end?"
            />
          </FormGroup>

          <FormToggle
            id="active"
            label="Course Status"
            v-model="form.active"
            :help-text="
              form.active
                ? 'Course is active and visible to students'
                : 'Course is inactive and hidden from students'
            "
          />

          <div class="flex justify-end space-x-3">
            <FormButton
              type="button"
              variant="secondary"
              @click="$emit('cancel')"
            >
              Cancel
            </FormButton>
            <FormButton type="submit" variant="primary">
              {{ isEditing ? "Update Course" : "Create Course" }}
            </FormButton>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from "vue";
import {
  Form,
  FormButton,
  FormGroup,
  FormInput,
  FormTextarea,
  FormToggle,
} from "@/components/form";

interface Course {
  id?: string;
  name: string;
  code?: string;
  description: string;
  active: boolean;
  startDate: string;
  endDate: string;
  studentCount?: number;
}

interface Props {
  course?: Course;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
});

const emit = defineEmits<{
  (e: "submit", course: Course): void;
  (e: "cancel"): void;
}>();

const form = reactive<Course>({
  name: "",
  description: "",
  active: true,
  startDate: "",
  endDate: "",
  studentCount: 0,
});

onMounted(() => {
  if (props.course && props.isEditing) {
    // Clone the course object to avoid mutating props
    Object.assign(form, props.course);
  }
});

function handleSubmit() {
  emit("submit", { ...form });
}
</script>
