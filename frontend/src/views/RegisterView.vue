<template>
  <AppLayout>
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          class="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900"
        >
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-neutral-600">
          Or
          <router-link
            to="/login"
            class="font-medium text-accent-600 hover:text-accent-500"
            >sign in to your existing account</router-link
          >
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          class="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10 border border-neutral-200"
        >
          <Form :error-message="errorMessage" @submit="register">
            <FormGroup :columns="2">
              <FormInput
                id="firstName"
                name="firstName"
                label="First name"
                v-model="firstName"
                required
                placeholder="John"
              />

              <FormInput
                id="lastName"
                name="lastName"
                label="Last name"
                v-model="lastName"
                required
                placeholder="Doe"
              />
            </FormGroup>

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              v-model="email"
              required
              autocomplete="email"
              placeholder="your-email@example.com"
              help-text="We'll never share your email with anyone else."
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              v-model="password"
              required
              :minlength="6"
              autocomplete="new-password"
              placeholder="••••••••"
              help-text="Password must be at least 6 characters long"
            />

            <FormButton
              type="submit"
              variant="primary"
              :loading="isLoading"
              loading-text="Creating account..."
              block
            >
              Create account
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
import { Form, FormButton, FormGroup, FormInput } from "@/components/form";

const router = useRouter();
const authStore = useAuthStore();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const register = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });
    router.push("/dashboard");
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value =
        "An error occurred during registration. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
