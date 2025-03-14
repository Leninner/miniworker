<template>
  <div class="tw-form-row">
    <label :for="id" class="block text-sm font-medium text-neutral-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
    <div class="tw-input-wrapper">
      <textarea
        :id="id"
        :name="name"
        :value="modelValue"
        @input="
          $emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value
          )
        "
        :required="required"
        :rows="rows"
        :placeholder="placeholder"
        class="shadow-sm focus:ring-accent-500 focus:border-accent-500 block w-full sm:text-sm border-neutral-300 rounded-md"
      ></textarea>
    </div>
    <p v-if="helpText" class="text-sm text-neutral-500">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 3,
  },
  placeholder: {
    type: String,
    default: "",
  },
  helpText: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);
</script>
