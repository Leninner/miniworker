<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-800">
    <!-- Navigation -->
    <nav
      class="bg-white shadow-soft sticky top-0 z-50 border-b border-neutral-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex items-center gap-x-6">
            <router-link
              to="/"
              class="text-2xl font-bold text-accent-700 hover:text-accent-800 transition-colors"
            >
              MiniWorker
            </router-link>
            <!-- Desktop Links -->
            <div
              class="hidden md:flex gap-x-4"
              v-if="authStore.isAuthenticated"
            >
              <router-link
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="font-medium text-neutral-700 hover:text-accent-600 flex gap-x-6"
                active-class="text-accent-700 font-bold"
              >
                {{ link.label }}
              </router-link>
            </div>
          </div>

          <!-- User Actions -->
          <div class="hidden md:flex items-center gap-x-4">
            <div
              v-if="authStore.isAuthenticated"
              class="flex items-center gap-x-3"
            >
              <span class="text-neutral-700 font-medium">{{
                userFullName
              }}</span>
              <button @click="logout" class="btn btn-outline text-sm">
                Logout
              </button>
            </div>
            <div v-else class="flex items-center gap-x-4">
              <router-link to="/login" class="btn btn-primary text-sm">
                Login
              </router-link>
              <router-link to="/register" class="btn btn-outline text-sm">
                Register
              </router-link>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
            aria-label="Toggle mobile menu"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white shadow-md p-4 gap-y-2 border-t border-neutral-200"
      >
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block py-2 px-4 text-neutral-700 hover:text-accent-600 hover:bg-neutral-50 rounded-md font-medium transition-colors"
          active-class="bg-accent-50 text-accent-700"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </router-link>
        <button
          v-if="authStore.isAuthenticated"
          @click="logout"
          class="block w-full text-left py-2 px-4 text-danger-600 hover:text-danger-800 hover:bg-danger-50 rounded-md font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-neutral-200 py-6 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="text-sm text-neutral-500">
              &copy; {{ new Date().getFullYear() }} MiniWorker. All rights
              reserved.
            </p>
          </div>
          <div class="flex gap-x-6">
            <a href="#" class="text-sm text-neutral-500 hover:text-accent-600"
              >Privacy Policy</a
            >
            <a href="#" class="text-sm text-neutral-500 hover:text-accent-600"
              >Terms of Service</a
            >
            <a href="#" class="text-sm text-neutral-500 hover:text-accent-600"
              >Contact</a
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const mobileMenuOpen = ref(false);

const userFullName = computed(() =>
  authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : ""
);

const logout = () => {
  authStore.logout();
  router.push("/login");
  mobileMenuOpen.value = false;
};

const navLinks = computed(() => {
  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/project-groups", label: "Project Groups" },
    { to: "/profile", label: "Profile" },
  ];
  if (authStore.isAdmin || authStore.isProfessor) {
    links.push({ to: "/agents", label: "Agents" });
  }
  if (authStore.isAdmin) {
    links.push({ to: "/admin", label: "Admin Panel" });
  }
  return links;
});
</script>
