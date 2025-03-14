<template>
  <AppLayout>
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

    <div
      v-else-if="!project"
      class="bg-white shadow rounded-lg p-6 text-center"
    >
      <svg
        class="h-12 w-12 text-gray-400 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Project not found</h3>
      <p class="mt-1 text-sm text-gray-500">
        The project you are looking for doesn't exist or you don't have access
        to it.
      </p>
      <div class="mt-6">
        <router-link to="/dashboard" class="btn btn-primary">
          Back to Dashboard
        </router-link>
      </div>
    </div>

    <div v-else>
      <!-- Project Header -->
      <div
        class="mb-6 flex flex-col md:flex-row justify-between md:items-center"
      >
        <div>
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ project.title }}
            </h1>
            <span
              class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(project.status)"
            >
              {{ formatStatus(project.status) }}
            </span>
            <span
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-purple-100 text-purple-800': project.isGroupProject,
                'bg-blue-100 text-blue-800': !project.isGroupProject,
              }"
            >
              {{
                project.isGroupProject ? "Group Project" : "Individual Project"
              }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Created on {{ formatDate(project.createdAt) }}
          </p>
        </div>

        <div class="mt-4 md:mt-0 flex flex-wrap gap-2">
          <router-link
            :to="`/projects/${projectId}/chat`"
            class="btn btn-primary"
          >
            <span class="flex items-center">
              <svg
                class="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Chat with Assistant
            </span>
          </router-link>

          <button
            v-if="userRole === 'student' && project.status === 'in_progress'"
            class="btn btn-success"
            @click="submitProject"
          >
            <span class="flex items-center">
              <svg
                class="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Submit Project
            </span>
          </button>

          <button
            v-if="userRole === 'professor' && project.status === 'submitted'"
            class="btn btn-success"
            @click="showGradeModal = true"
          >
            <span class="flex items-center">
              <svg
                class="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Grade Project
            </span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Project Details Section -->
        <div class="md:col-span-2">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Project Details
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <!-- Project Information -->
              <div class="card mb-6">
                <div class="card-header">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    Project Information
                  </h3>
                </div>
                <div class="card-body">
                  <!-- Project Details -->
                  <div class="mb-4">
                    <div class="text-sm font-medium text-gray-500 mb-2">
                      <span class="text-gray-800 font-semibold">Status:</span>
                      <span
                        class="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(project.status)"
                      >
                        {{ formatStatus(project.status) }}
                      </span>
                    </div>

                    <!-- Project Assignment Info -->
                    <div class="text-sm font-medium text-gray-500 mb-2">
                      <span class="text-gray-800 font-semibold"
                        >Assignment Type:</span
                      >
                      <span
                        class="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-purple-100 text-purple-800':
                            project.isGroupProject,
                          'bg-blue-100 text-blue-800': !project.isGroupProject,
                        }"
                      >
                        {{
                          project.isGroupProject
                            ? "Group Project"
                            : "Individual Project"
                        }}
                      </span>
                    </div>

                    <!-- Student or Group Info -->
                    <div
                      v-if="project.isGroupProject"
                      class="text-sm font-medium text-gray-500 mb-2"
                    >
                      <span class="text-gray-800 font-semibold">Group:</span>
                      <span class="text-gray-600 ml-1">{{
                        project.group?.name || "Unknown Group"
                      }}</span>
                    </div>
                    <div v-else class="text-sm font-medium text-gray-500 mb-2">
                      <span class="text-gray-800 font-semibold">Student:</span>
                      <span class="text-gray-600 ml-1"
                        >{{ project.student?.firstName }}
                        {{ project.student?.lastName }}</span
                      >
                    </div>

                    <!-- Group Members (Only for group projects) -->
                    <div
                      v-if="
                        project.isGroupProject && project.group?.members?.length
                      "
                      class="mb-4"
                    >
                      <div class="text-sm font-medium text-gray-800 mb-2">
                        Group Members:
                      </div>
                      <ul class="space-y-2">
                        <li
                          v-for="member in project.group.members"
                          :key="member.id"
                          class="flex items-center"
                        >
                          <div class="flex-shrink-0">
                            <img
                              v-if="member.profilePicture"
                              :src="member.profilePicture"
                              alt="Profile"
                              class="w-6 h-6 rounded-full"
                            />
                            <div
                              v-else
                              class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                            >
                              <span class="text-gray-600 text-xs"
                                >{{ member.firstName.charAt(0)
                                }}{{ member.lastName.charAt(0) }}</span
                              >
                            </div>
                          </div>
                          <span class="ml-2 text-sm text-gray-600"
                            >{{ member.firstName }} {{ member.lastName }}</span
                          >
                        </li>
                      </ul>
                    </div>

                    <!-- Project Assistant (formerly Agent) -->
                    <div class="text-sm font-medium text-gray-500 mb-2">
                      <span class="text-gray-800 font-semibold"
                        >Assistant:</span
                      >
                      <span class="text-gray-600 ml-1">{{
                        project.agent?.name || "Carlos"
                      }}</span>
                    </div>

                    <!-- Project Professor -->
                    <div class="text-sm font-medium text-gray-500 mb-2">
                      <span class="text-gray-800 font-semibold"
                        >Professor:</span
                      >
                      <span class="text-gray-600 ml-1"
                        >{{ project.professor?.firstName }}
                        {{ project.professor?.lastName }}</span
                      >
                    </div>

                    <!-- Timeline -->
                    <div class="text-sm font-medium text-gray-500 mb-2">
                      <span class="text-gray-800 font-semibold">Timeline:</span>
                      <span class="text-gray-600 ml-1"
                        >{{ formatDate(project.startDate) }} -
                        {{ formatDate(project.endDate) }}</span
                      >
                    </div>
                  </div>

                  <!-- Project Description -->
                  <div class="prose max-w-none">
                    {{ project.description }}
                  </div>

                  <!-- Group Members (Only for group projects) -->
                  <div
                    v-if="
                      project.isGroupProject && project.group?.members?.length
                    "
                    class="mt-4"
                  >
                    <GroupMembers
                      :members="project.group.members"
                      :loading="isLoading"
                      show-role
                    />
                  </div>
                </div>
              </div>

              <!-- Report Downloader Section -->
              <div class="mb-6">
                <ReportDownloader entityType="project" :entityId="projectId" />
              </div>

              <!-- Project Timeline -->
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-2">
                  Project Timeline
                </h4>
                <div class="relative pb-8">
                  <div
                    class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></div>

                  <div
                    v-for="(milestone, index) in milestones"
                    :key="index"
                    class="relative flex items-start space-x-3 pb-6"
                  >
                    <div>
                      <div class="relative px-1">
                        <div
                          class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white"
                        >
                          <svg
                            class="h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900">{{
                            milestone.title
                          }}</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ milestone.date }}
                        </p>
                      </div>
                      <div class="mt-2 text-sm text-gray-700">
                        <p>{{ milestone.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Project Progress
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="text-sm font-medium text-gray-900">
                    Overall Progress
                  </div>
                  <div class="text-sm font-medium text-gray-500">
                    {{ project.progress || 0 }}%
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-600 h-2.5 rounded-full"
                    :style="{ width: `${project.progress || 0}%` }"
                  ></div>
                </div>
              </div>

              <!-- Recent Project Updates -->
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-4">
                  Recent Updates
                </h4>
                <div
                  v-if="updates.length === 0"
                  class="text-sm text-gray-500 italic"
                >
                  No updates have been recorded yet.
                </div>
                <div v-else class="space-y-4">
                  <div
                    v-for="(update, index) in updates"
                    :key="index"
                    class="bg-gray-50 p-4 rounded-lg"
                  >
                    <div class="flex justify-between items-start">
                      <h5 class="text-sm font-medium text-gray-900">
                        {{ update.title }}
                      </h5>
                      <span class="text-xs text-gray-500">{{
                        formatDate(update.date)
                      }}</span>
                    </div>
                    <p class="mt-1 text-sm text-gray-600">
                      {{ update.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Information -->
        <div class="md:col-span-1">
          <!-- Assistant Information (formerly Agent Information) -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Your Assistant
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-0">
              <dl class="sm:divide-y sm:divide-gray-200">
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ project.agent?.name || "Carlos" }}
                  </dd>
                </div>
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Personality</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-blue-100 text-blue-800':
                          project.agent?.personality === 'analytical',
                        'bg-red-100 text-red-800':
                          project.agent?.personality === 'demanding',
                        'bg-green-100 text-green-800':
                          project.agent?.personality === 'supportive',
                        'bg-purple-100 text-purple-800':
                          project.agent?.personality === 'creative',
                        'bg-orange-100 text-orange-800':
                          project.agent?.personality === 'challenging',
                      }"
                    >
                      {{ project.agent?.personality || "Supportive" }}
                    </span>
                  </dd>
                </div>
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Expertise</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{
                      project.agent?.problemCategory || "Business Automation"
                    }}
                  </dd>
                </div>
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">About</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Carlos is your dedicated assistant who specializes in
                    helping students with business automation projects. He's
                    patient, knowledgeable, and always ready to provide guidance
                    when you need it.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Student/Professor Information -->
          <div
            v-if="userRole === 'professor' && project.student"
            class="bg-white shadow overflow-hidden sm:rounded-lg mb-6"
          >
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Student Information
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-0">
              <dl class="sm:divide-y sm:divide-gray-200">
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ project.student.name }}
                  </dd>
                </div>
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ project.student.email }}
                  </dd>
                </div>
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">ID</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ project.student.id }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Evaluation Information (if graded) -->
          <div
            v-if="project.grade"
            class="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Project Evaluation
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-0">
              <dl class="sm:divide-y sm:divide-gray-200">
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Grade</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {{ project.grade }}/10
                    </span>
                  </dd>
                </div>
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Feedback</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ project.feedback || "No feedback provided." }}
                  </dd>
                </div>
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Graded By</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ project.gradedBy?.name || "Unknown professor" }}
                  </dd>
                </div>
                <div
                  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt class="text-sm font-medium text-gray-500">Graded On</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(project.gradedAt) }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Grading Modal (for professors) -->
      <div
        v-if="showGradeModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="showGradeModal = false"
          ></div>
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
                <div
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <svg
                    class="h-6 w-6 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Grade Project
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Please provide a grade and feedback for
                      {{ project.student?.name }}'s project.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-6 space-y-4">
                <div>
                  <label
                    for="grade"
                    class="block text-sm font-medium text-gray-700"
                    >Grade (1-10)</label
                  >
                  <input
                    type="number"
                    min="1"
                    max="10"
                    id="grade"
                    v-model="gradeData.grade"
                    class="mt-1 form-input"
                  />
                </div>
                <div>
                  <label
                    for="feedback"
                    class="block text-sm font-medium text-gray-700"
                    >Feedback</label
                  >
                  <textarea
                    id="feedback"
                    rows="4"
                    v-model="gradeData.feedback"
                    class="mt-1 form-textarea"
                    placeholder="Provide detailed feedback about the project..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                @click="submitGrade"
              >
                Submit Grade
              </button>
              <button
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="showGradeModal = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppLayout from "@/components/layout/AppLayout.vue";
import ReportDownloader from "@/components/ReportDownloader.vue";
import GroupMembers from "@/components/GroupMembers.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const projectId = route.params.id as string;

// State
const project = ref<any>(null);
const isLoading = ref(true);
const updates = ref<any[]>([]);
const showGradeModal = ref(false);
const gradeData = ref({
  grade: 8,
  feedback: "",
});

// Computed
const userRole = computed(() => authStore.user?.role || "student");

// Mock data for the milestones
const milestones = [
  {
    title: "Project Created",
    date: "May 1, 2023",
    description: "Project was created and assigned an AI agent.",
  },
  {
    title: "Initial Requirements Defined",
    date: "May 5, 2023",
    description:
      "Student worked with the agent to define initial requirements and scope.",
  },
  {
    title: "Progress Report Submitted",
    date: "May 15, 2023",
    description:
      "Student submitted a progress report detailing the work completed so far.",
  },
];

// Methods
async function fetchProject() {
  try {
    isLoading.value = true;
    // In a real app, we would make an API call to get the project data
    // const response = await apiService.getProject(projectId);
    // project.value = response.data;

    // Mock data for development
    setTimeout(() => {
      project.value = {
        id: projectId,
        title: "Inventory Management System",
        status: "in_progress",
        problemStatement:
          "Design an automated inventory management system for a small retail business with multiple locations. The system should track inventory levels in real-time, automate order management, and provide analytics to help optimize stock levels.",
        progress: 65,
        createdAt: "2023-05-01T10:30:00Z",
        student: {
          id: "1001",
          name: "John Smith",
          email: "john.smith@university.edu",
        },
        agent: {
          id: "1",
          name: "Business Automation Agent",
          personality: "analytical",
          problemCategory: "automation",
        },
      };

      fetchUpdates();
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error("Error fetching project:", error);
    isLoading.value = false;
  }
}

async function fetchUpdates() {
  try {
    // In a real app, we would make an API call to get the project updates
    // const response = await apiService.getUpdates(projectId);
    // updates.value = response.data;

    // Mock data for development
    updates.value = [
      {
        id: "1",
        title: "Database Schema Designed",
        content:
          "Created the initial database schema with tables for inventory items, suppliers, orders, and locations.",
        date: "2023-05-10T14:25:00Z",
      },
      {
        id: "2",
        title: "User Interface Mockups Completed",
        content:
          "Finished designing wireframes for the main inventory dashboard, product catalog, and order management screens.",
        date: "2023-05-15T11:15:00Z",
      },
      {
        id: "3",
        title: "API Integration Started",
        content:
          "Began integrating with supplier APIs for automated order processing and tracking.",
        date: "2023-05-20T09:45:00Z",
      },
    ];
  } catch (error) {
    console.error("Error fetching updates:", error);
  }
}

function formatDate(dateString: string | Date) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatStatus(status: string) {
  if (!status) return "Unknown";

  const statusMap: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    submitted: "Submitted",
    graded: "Graded",
  };

  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClass(status: string) {
  const statusClasses: Record<string, string> = {
    pending: "rounded-full px-2 py-1 text-sm status-pending",
    in_progress: "rounded-full px-2 py-1 text-sm status-active",
    completed: "rounded-full px-2 py-1 text-sm status-completed",
    submitted: "rounded-full px-2 py-1 text-sm bg-accent-500 text-white",
    graded: "rounded-full px-2 py-1 text-sm bg-purple-500 text-white",
    failed: "rounded-full px-2 py-1 text-sm status-failed",
  };

  return (
    statusClasses[status] ||
    "rounded-full px-2 py-1 text-sm bg-neutral-500 text-white"
  );
}

async function submitProject() {
  try {
    // In a real app, we would make an API call to submit the project
    // const response = await apiService.submitProject(projectId);

    // For demo, just update the project status
    project.value.status = "submitted";

    // Show success message
    alert("Project successfully submitted for grading!");
  } catch (error) {
    console.error("Error submitting project:", error);
    alert("Error submitting project. Please try again.");
  }
}

async function submitGrade() {
  try {
    // Validate the grade
    if (gradeData.value.grade < 1 || gradeData.value.grade > 10) {
      alert("Please enter a grade between 1 and 10.");
      return;
    }

    // In a real app, we would make an API call to submit the grade
    // const response = await apiService.submitGrade(projectId, gradeData.value);

    // For demo, just update the project data
    project.value.status = "graded";
    project.value.grade = gradeData.value.grade;
    project.value.feedback = gradeData.value.feedback;
    project.value.gradedBy = {
      name:
        `${authStore.user?.firstName} ${authStore.user?.lastName}` ||
        "Professor",
    };
    project.value.gradedAt = new Date().toISOString();

    // Hide the modal
    showGradeModal.value = false;

    // Show success message
    alert("Project has been successfully graded!");
  } catch (error) {
    console.error("Error grading project:", error);
    alert("Error grading project. Please try again.");
  }
}

// Lifecycle
onMounted(() => {
  fetchProject();
});
</script>
