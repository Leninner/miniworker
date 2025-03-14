<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import AppLayout from "@/components/AppLayout.vue";

const authStore = useAuthStore();
</script>

<template>
  <div>
    <AppLayout>
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MiniWorker
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          A platform for university students to collaborate with AI agents on
          real-world problems
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="btn btn-primary text-lg px-8 py-3"
          >
            Get Started
          </router-link>
          <router-link
            v-else
            to="/dashboard"
            class="btn btn-primary text-lg px-8 py-3"
          >
            Go to Dashboard
          </router-link>
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="btn btn-secondary text-lg px-8 py-3"
          >
            Login
          </router-link>
        </div>

        <!-- Features section -->
        <div class="bg-white py-12 rounded-xl shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
              <h2
                class="text-base text-blue-600 font-semibold tracking-wide uppercase"
              >
                Features
              </h2>
              <p
                class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              >
                What makes MiniWorker special
              </p>
              <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our platform provides a unique learning experience that bridges
                the gap between academic learning and real-world
                problem-solving.
              </p>
            </div>

            <div class="mt-10">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="card text-center">
                  <div class="flex justify-center">
                    <svg
                      class="h-12 w-12 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="mt-4 text-lg font-medium text-gray-900">
                    AI-Powered Agents
                  </h3>
                  <p class="mt-2 text-base text-gray-500">
                    Interact with AI agents simulating real-world clients with
                    technical, automation, and innovation challenges.
                  </p>
                </div>

                <div class="card text-center">
                  <div class="flex justify-center">
                    <svg
                      class="h-12 w-12 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="mt-4 text-lg font-medium text-gray-900">
                    Project Timeline Management
                  </h3>
                  <p class="mt-2 text-base text-gray-500">
                    Track project progress, manage deadlines, and submit
                    deliverables through an intuitive timeline interface.
                  </p>
                </div>

                <div class="card text-center">
                  <div class="flex justify-center">
                    <svg
                      class="h-12 w-12 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="mt-4 text-lg font-medium text-gray-900">
                    Spider Web Evaluation
                  </h3>
                  <p class="mt-2 text-base text-gray-500">
                    Receive comprehensive feedback on engineering skills using
                    our multidimensional spider web assessment system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  </div>
</template>
