<template>
  <div class="bg-white shadow overflow-hidden rounded-lg">
    <div class="px-6 py-5 sm:px-8 border-b border-neutral-200">
      <h2 class="text-xl font-bold text-neutral-900 mb-1">
        Course Enrollment QR Code
      </h2>
      <p class="text-sm text-neutral-500 mb-0">
        Students can scan this QR code to enroll in the course
      </p>
    </div>
    <div class="p-8 flex flex-col items-center">
      <div v-if="loading" class="flex justify-center mb-4">
        <div class="spinner"></div>
      </div>
      <div v-else class="qr-code-container mb-4">
        <img
          :src="qrCodeUrl"
          alt="Course enrollment QR code"
          class="w-64 h-64"
        />
      </div>
      <div class="text-center">
        <p class="text-neutral-600 mb-2">
          <span class="font-medium">Enrollment Link:</span>
          <a
            :href="enrollmentUrl"
            target="_blank"
            class="text-accent-600 hover:text-accent-800"
          >
            {{ enrollmentUrl }}
          </a>
        </p>
        <div class="mt-4">
          <button
            @click="copyEnrollmentLink"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            <svg
              class="mr-2 -ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            Copy Link
          </button>
          <button
            @click="downloadQRCode"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-accent-700 bg-accent-100 hover:bg-accent-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            <svg
              class="mr-2 -ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from "vue";

interface Props {
  courseId: string;
  courseName: string;
}

const props = defineProps<Props>();
const loading = ref(true);
const qrCodeUrl = ref("");
const enrollmentUrl = ref("");
const linkCopied = ref(false);

onMounted(async () => {
  // In a real implementation, you would generate the QR code on the server
  // or use a library like qrcode.vue to generate it client-side
  // For this example, we'll simulate loading the QR code
  loading.value = true;

  // Simulate API call to get enrollment URL and QR code
  setTimeout(() => {
    enrollmentUrl.value = `${window.location.origin}/enroll/${props.courseId}`;

    // In a real implementation, you would generate the QR code with the enrollment URL
    // For this example, we'll use a placeholder QR code service
    qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(enrollmentUrl.value)}`;

    loading.value = false;
  }, 1000);
});

function copyEnrollmentLink() {
  navigator.clipboard
    .writeText(enrollmentUrl.value)
    .then(() => {
      linkCopied.value = true;
      setTimeout(() => {
        linkCopied.value = false;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy link: ", err);
    });
}

function downloadQRCode() {
  // Create a temporary link element
  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = `${props.courseName.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
