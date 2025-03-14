<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">Profile</h1>

      <div v-if="loading" class="flex justify-center my-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div v-else>
        <form @submit.prevent="updateProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- First Name -->
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >First Name</label
              >
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <!-- Last Name -->
            <div>
              <label
                for="lastName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Last Name</label
              >
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                disabled
              />
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <!-- Role -->
            <div>
              <label
                for="role"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Role</label
              >
              <input
                id="role"
                v-model="form.role"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                disabled
              />
              <p class="text-xs text-gray-500 mt-1">
                Role is assigned by administrators
              </p>
            </div>
          </div>

          <!-- Change Password Section -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">
              Change Password
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  for="currentPassword"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Current Password</label
                >
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    for="newPassword"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >New Password</label
                  >
                  <input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Confirm New Password</label
                  >
                  <input
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="updating"
            >
              {{ updating ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Alert Message -->
      <div
        v-if="alert.show"
        :class="[
          'fixed top-4 right-4 p-4 rounded-md shadow-lg max-w-md transition-all duration-300',
          alert.type === 'success'
            ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
            : 'bg-red-100 border-l-4 border-red-500 text-red-700',
        ]"
      >
        <div class="flex items-center">
          <span v-if="alert.type === 'success'" class="mr-2">✓</span>
          <span v-else class="mr-2">✗</span>
          <p>{{ alert.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { userService } from "@/services/api";

export default {
  name: "ProfileView",
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    const loading = ref(true);
    const updating = ref(false);

    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    });

    const passwordForm = reactive({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const alert = reactive({
      show: false,
      type: "success",
      message: "",
    });

    const showAlert = (type, message) => {
      alert.show = true;
      alert.type = type;
      alert.message = message;

      setTimeout(() => {
        alert.show = false;
      }, 3000);
    };

    const loadUserData = async () => {
      try {
        loading.value = true;
        const response = await userService.getUser(user.value.id);
        const userData = response.data;

        form.firstName = userData.firstName;
        form.lastName = userData.lastName;
        form.email = userData.email;
        form.role = userData.role;
      } catch (error) {
        console.error("Error loading user data:", error);
        showAlert("error", "Failed to load user profile");
      } finally {
        loading.value = false;
      }
    };

    const updateProfile = async () => {
      try {
        updating.value = true;

        // Prepare user data update
        const userData = {
          firstName: form.firstName,
          lastName: form.lastName,
        };

        // If password change was requested
        if (passwordForm.newPassword) {
          // Validate passwords match
          if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showAlert("error", "New passwords do not match");
            return;
          }

          // Add password data
          userData.currentPassword = passwordForm.currentPassword;
          userData.newPassword = passwordForm.newPassword;
        }

        // Update user profile
        await userService.updateUser(user.value.id, userData);

        // Update local auth store
        authStore.user = {
          ...authStore.user,
          firstName: form.firstName,
          lastName: form.lastName,
        };

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(authStore.user));

        // Reset password form
        passwordForm.currentPassword = "";
        passwordForm.newPassword = "";
        passwordForm.confirmPassword = "";

        showAlert("success", "Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        showAlert(
          "error",
          error.response?.data?.message || "Failed to update profile"
        );
      } finally {
        updating.value = false;
      }
    };

    const resetForm = () => {
      loadUserData();
      passwordForm.currentPassword = "";
      passwordForm.newPassword = "";
      passwordForm.confirmPassword = "";
    };

    onMounted(() => {
      loadUserData();
    });

    return {
      user,
      form,
      passwordForm,
      loading,
      updating,
      alert,
      updateProfile,
      resetForm,
    };
  },
};
</script>
