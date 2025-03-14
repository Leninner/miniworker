<template>
  <AppLayout>
    <div class="flex min-h-[70vh] flex-col justify-center py-8 sm:py-12">
      <div class="mx-auto w-full max-w-md">
        <h2
          class="text-center text-3xl font-bold tracking-tight text-neutral-900 mb-4"
        >
          Sign in to your account
        </h2>
        <p class="text-center text-sm text-neutral-600 mb-4">
          Or
          <router-link
            to="/register"
            class="font-medium text-accent-600 hover:text-accent-700"
            >create a new account</router-link
          >
        </p>
      </div>

      <div class="mt-8 mx-auto w-full max-w-md">
        <div
          class="bg-white py-8 px-6 shadow-card rounded-lg sm:px-10 border border-neutral-200"
        >
          <Form :error-message="errorMessage" @submit="login">
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              v-model="email"
              required
              autocomplete="email"
              placeholder="your-email@example.com"
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              v-model="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              help-text="At least 8 characters"
            />

            <div class="flex items-center justify-between">
              <FormCheckbox
                id="remember-me"
                name="remember-me"
                label="Remember me"
                v-model="rememberMe"
              />
              <div class="text-sm">
                <a
                  href="#"
                  class="font-medium text-accent-600 hover:text-accent-700"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <FormButton
              type="submit"
              variant="primary"
              :loading="isLoading"
              loading-text="Signing in..."
              block
            >
              Sign in
            </FormButton>
          </Form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppLayout from "@/components/layout/AppLayout.vue";
import { Form, FormButton, FormCheckbox, FormInput } from "@/components/form";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const login = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    await authStore.login(email.value, password.value);
    router.push("/dashboard");
  } catch (error: any) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "An error occurred during login. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
