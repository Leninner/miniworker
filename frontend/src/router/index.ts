import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/projects/create',
      name: 'create-project',
      component: () => import('../views/CreateProjectView.vue'),
      meta: { requiresAuth: true, roles: ['student'] }
    },
    {
      path: '/projects/:id',
      name: 'ProjectDetail',
      component: () => import('../views/ProjectDetailView.vue'),
      meta: { requiresAuth: true, roles: ['student', 'professor', 'admin'] }
    },
    {
      path: '/projects/:id/chat',
      name: 'ProjectChat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true, roles: ['student', 'professor', 'admin'] }
    },
    {
      path: '/projects/:id/evaluation',
      name: 'ProjectEvaluation',
      component: () => import('../views/EvaluationView.vue'),
      meta: { requiresAuth: true, roles: ['student', 'professor', 'admin'] }
    },
    {
      path: '/project-groups',
      name: 'ProjectGroups',
      component: () => import('../views/ProjectGroupsView.vue'),
      meta: { requiresAuth: true, roles: ['student', 'professor', 'admin'] }
    },
    {
      path: '/project-groups/:id',
      name: 'ProjectGroupDetail',
      component: () => import('../views/ProjectGroupDetailView.vue'),
      meta: { requiresAuth: true, roles: ['student', 'professor', 'admin'] }
    },
    {
      path: '/agents',
      name: 'agents',
      component: () => import('../views/AgentsView.vue'),
      meta: { requiresAuth: true, roles: ['professor', 'admin'] }
    },
    {
      path: '/agents/:id',
      name: 'agent-detail',
      component: () => import('../views/AgentDetailView.vue'),
      meta: { requiresAuth: true, roles: ['professor', 'admin'] }
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/CoursesView.vue'),
      meta: { requiresAuth: true, roles: ['student', 'professor', 'admin'] }
    },
    {
      path: '/courses/:id',
      name: 'course-detail',
      component: () => import('../views/CourseDetailView.vue'),
      meta: { requiresAuth: true, roles: ['student', 'professor', 'admin'] }
    },
    {
      path: '/enroll/:courseId',
      name: 'course-enrollment',
      component: () => import('../views/CourseEnrollmentView.vue'),
      meta: { requiresAuth: true, roles: ['student'] }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresRole = to.matched.some(record => record.meta.roles)

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (
    requiresRole &&
    to.meta.roles && 
    Array.isArray(to.meta.roles) &&
    authStore.user?.role &&
    !to.meta.roles.includes(authStore.user.role)
  ) {
    next("/dashboard");
  } else {
    next();
  }
})

export default router
