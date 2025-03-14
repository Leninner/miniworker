<template>
  <div class="bg-white p-4 rounded-lg shadow-sm">
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-900">Descargar Reportes</h3>
      <p class="text-sm text-gray-500">
        Genera y descarga reportes en formato PDF para este {{ entityType }}.
      </p>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        v-for="report in availableReports"
        :key="report.type"
        @click="downloadReport(report.type)"
        class="btn btn-secondary flex items-center"
        :disabled="loading"
      >
        <svg
          v-if="loading && currentReport === report.type"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
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
        <svg
          v-else
          class="h-4 w-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          ></path>
        </svg>
        {{ report.label }}
      </button>
    </div>

    <!-- Options dialog -->
    <div
      v-if="showOptions"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
      @click.self="showOptions = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Opciones de Reporte
        </h3>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">
              Incluir título
            </label>
            <input
              type="checkbox"
              v-model="reportOptions.includeTitle"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">
              Incluir logo
            </label>
            <input
              type="checkbox"
              v-model="reportOptions.includeLogo"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">
              Incluir fecha
            </label>
            <input
              type="checkbox"
              v-model="reportOptions.includeTimestamp"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700"> Idioma </label>
            <select
              v-model="reportOptions.language"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">
              Esquema de color
            </label>
            <select
              v-model="reportOptions.colorScheme"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
              <option value="default">Por defecto</option>
              <option value="dark">Oscuro</option>
              <option value="light">Claro</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700"> Formato </label>
            <select
              v-model="reportOptions.format"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
              <option value="A4">A4</option>
              <option value="Letter">Carta</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showOptions = false" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="confirmDownload" class="btn btn-primary">
            Descargar
          </button>
        </div>
      </div>
    </div>

    <!-- Error toast -->
    <div
      v-if="errorMessage"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg max-w-xs"
    >
      {{ errorMessage }}
      <button
        @click="errorMessage = ''"
        class="ml-2 text-white focus:outline-none"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReportOptions } from "@/types";
import { ref, computed } from "vue";
import apiClient from "@/services/api";

// Props
const props = defineProps({
  entityType: {
    type: String,
    required: true,
    validator: (value: string) =>
      ["project", "evaluation", "student"].includes(value),
  },
  entityId: {
    type: String,
    required: true,
  },
});

// State
const loading = ref(false);
const currentReport = ref("");
const showOptions = ref(false);
const reportToDownload = ref("");
const errorMessage = ref("");

// Report options
const reportOptions = ref<ReportOptions>({
  includeTitle: true,
  includeLogo: true,
  includeTimestamp: true,
  language: "es",
  colorScheme: "default",
  format: "A4",
});

// Available reports based on entity type
const availableReports = computed(() => {
  switch (props.entityType) {
    case "project":
      return [{ type: "project", label: "Reporte de Proyecto" }];
    case "evaluation":
      return [{ type: "evaluation", label: "Reporte de Evaluación" }];
    case "student":
      return [{ type: "student-performance", label: "Reporte de Rendimiento" }];
    default:
      return [];
  }
});

// Report download URLs
const getReportUrl = (reportType: string): string => {
  switch (reportType) {
    case "project":
      return `${apiClient.getProjectReport(props.entityId, reportOptions.value)}`;
    case "evaluation":
      return `${apiClient.getEvaluationReport(props.entityId, reportOptions.value)}`;
    case "student-performance":
      return `${apiClient.getStudentPerformanceReport(props.entityId, reportOptions.value)}`;
    default:
      return "";
  }
};

// Show options dialog before downloading
const downloadReport = (reportType: string) => {
  reportToDownload.value = reportType;
  showOptions.value = true;
};

// Confirm and start download after options are set
const confirmDownload = async () => {
  showOptions.value = false;

  if (!reportToDownload.value) return;

  loading.value = true;
  currentReport.value = reportToDownload.value;

  try {
    const reportUrl = getReportUrl(reportToDownload.value);

    // Create a download link and click it
    const a = document.createElement("a");
    a.href = reportUrl;
    a.download = `report-${props.entityType}-${props.entityId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Wait a moment before hiding the loading indicator
    setTimeout(() => {
      loading.value = false;
      currentReport.value = "";
    }, 1000);
  } catch (error) {
    console.error("Error downloading report:", error);
    errorMessage.value = "Error al descargar el reporte. Intente nuevamente.";
    loading.value = false;
    currentReport.value = "";

    // Auto-hide error after 5 seconds
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  }
};
</script>
