import axios from 'axios'

// Create an Axios instance with custom config
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add a request interceptor to include the auth token on every request
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    const { response } = error

    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Only redirect to login if we're not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
const authService = {
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  register(userData) {
    return apiClient.post('/auth/register', userData)
  },
  getProfile() {
    return apiClient.get('/auth/profile')
  }
}

// User endpoints
const userService = {
  getUsers() {
    return apiClient.get('/users')
  },
  getUser(id) {
    return apiClient.get(`/users/${id}`)
  },
  updateUser(id, userData) {
    return apiClient.patch(`/users/${id}`, userData)
  },
  updateUserStatus(id, statusData) {
    return apiClient.patch(`/users/${id}/status`, statusData)
  }
}

// Project endpoints
const projectService = {
  getProjects(params = {}) {
    return apiClient.get('/projects', { params })
  },
  getProject(id) {
    return apiClient.get(`/projects/${id}`)
  },
  createProject(projectData) {
    return apiClient.post('/projects', projectData)
  },
  updateProject(id, projectData) {
    return apiClient.patch(`/projects/${id}`, projectData)
  },
  deleteProject(id) {
    return apiClient.delete(`/projects/${id}`)
  },
  submitProject(id) {
    return apiClient.post(`/projects/${id}/submit`)
  },
  gradeProject(id, gradeData) {
    return apiClient.post(`/projects/${id}/grade`, gradeData)
  }
}

// Messages endpoints
const messageService = {
  getMessages(projectId) {
    return apiClient.get(`/projects/${projectId}/messages`)
  },
  sendMessage(projectId, message) {
    return apiClient.post(`/projects/${projectId}/messages`, message)
  }
}

// Agent endpoints
const agentService = {
  getAgents(params = {}) {
    return apiClient.get('/agents', { params })
  },
  getAgent(id) {
    return apiClient.get(`/agents/${id}`)
  },
  createAgent(agentData) {
    return apiClient.post('/agents', agentData)
  },
  updateAgent(id, agentData) {
    return apiClient.patch(`/agents/${id}`, agentData)
  },
  deleteAgent(id) {
    return apiClient.delete(`/agents/${id}`)
  },
  
  // AI interaction methods - these now call the backend directly
  getAgentGreeting(agentId) {
    return apiClient.get(`/agents/${agentId}/greeting`)
  },
  
  getAgentFeedback(agentId, message) {
    return apiClient.post(`/agents/${agentId}/feedback`, { message })
  },
  
  evaluateSubmission(agentId, submission) {
    return apiClient.post(`/agents/${agentId}/evaluate`, submission)
  },
  
  getNextSteps(agentId, projectId) {
    return apiClient.get(`/agents/${agentId}/projects/${projectId}/next-steps`)
  }
}

// Project updates endpoints
const updateService = {
  getUpdates(projectId) {
    return apiClient.get(`/projects/${projectId}/updates`)
  },
  createUpdate(projectId, updateData) {
    return apiClient.post(`/projects/${projectId}/updates`, updateData)
  }
}

// Report endpoints
const reportService = {
  getProjectReport(projectId, options = {}) {
    const queryString = formatOptionsQuery(options)
    return apiClient.get(`/reports/projects/${projectId}${queryString}`)
  },
  getEvaluationReport(evaluationId, options = {}) {
    const queryString = formatOptionsQuery(options)
    return apiClient.get(`/reports/evaluations/${evaluationId}${queryString}`)
  },
  getStudentPerformanceReport(studentId, options = {}) {
    const queryString = formatOptionsQuery(options)
    return apiClient.get(`/reports/students/${studentId}/performance${queryString}`)
  }
}

// Helper function to format query parameters
function formatOptionsQuery(options) {
  if (!options || Object.keys(options).length === 0) {
    return ''
  }

  const params = new URLSearchParams()
  
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value)
    }
  })

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

// Milestone endpoints
const milestoneService = {
  getMilestones(projectId) {
    return apiClient.get(`/projects/${projectId}/milestones`)
  },
  getMilestone(projectId, milestoneId) {
    return apiClient.get(`/projects/${projectId}/milestones/${milestoneId}`)
  },
  createMilestone(projectId, milestoneData) {
    return apiClient.post(`/projects/${projectId}/milestones`, milestoneData)
  },
  updateMilestone(projectId, milestoneId, milestoneData) {
    return apiClient.patch(`/projects/${projectId}/milestones/${milestoneId}`, milestoneData)
  },
  submitMilestone(projectId, milestoneId, submissionData) {
    return apiClient.post(`/projects/${projectId}/milestones/${milestoneId}/submit`, submissionData)
  }
}

// Evaluation endpoints
const evaluationService = {
  getEvaluations(projectId) {
    return apiClient.get(`/projects/${projectId}/evaluations`)
  },
  getEvaluation(projectId, evaluationId) {
    return apiClient.get(`/projects/${projectId}/evaluations/${evaluationId}`)
  },
  createEvaluation(projectId, evaluationData) {
    return apiClient.post(`/projects/${projectId}/evaluations`, evaluationData)
  },
  updateEvaluation(projectId, evaluationId, evaluationData) {
    return apiClient.patch(`/projects/${projectId}/evaluations/${evaluationId}`, evaluationData)
  },
  analyzeSubmission(projectId, milestoneId) {
    return apiClient.post(`/projects/${projectId}/milestones/${milestoneId}/analyze`)
  },
  generateRecommendations(projectId, evaluationId) {
    return apiClient.post(`/projects/${projectId}/evaluations/${evaluationId}/recommendations`)
  },
  getSubmissionAnalysis(projectId, milestoneId) {
    return apiClient.get(`/projects/${projectId}/milestones/${milestoneId}/analysis`)
  }
}

// Project Group endpoints
const projectGroupService = {
  getAllProjectGroups() {
    return apiClient.get('/project-groups')
  },
  
  getProjectGroup(id) {
    return apiClient.get(`/project-groups/${id}`)
  },
  
  getManagedGroups() {
    return apiClient.get('/project-groups/managed')
  },
  
  createGroup(groupData) {
    return apiClient.post('/project-groups', groupData)
  },
  
  updateGroup(id, groupData) {
    return apiClient.patch(`/project-groups/${id}`, groupData)
  },
  
  addMember(groupId, userId) {
    return apiClient.post(`/project-groups/${groupId}/members`, { userId })
  },
  
  removeMember(groupId, userId) {
    return apiClient.delete(`/project-groups/${groupId}/members/${userId}`)
  },
  
  assignProject(groupId, projectId) {
    return apiClient.post(`/project-groups/${groupId}/projects`, { projectId })
  },
  
  deleteGroup(id) {
    return apiClient.delete(`/project-groups/${id}`)
  }
}

// Course endpoints
const courseService = {
  getCourses(params = {}) {
    return apiClient.get('/courses', { params })
  },
  getCourse(id) {
    return apiClient.get(`/courses/${id}`)
  },
  createCourse(courseData) {
    return apiClient.post('/courses', courseData)
  },
  updateCourse(id, courseData) {
    return apiClient.patch(`/courses/${id}`, courseData)
  },
  deleteCourse(id) {
    return apiClient.delete(`/courses/${id}`)
  },
  enrollStudent(courseId, studentId) {
    return apiClient.post(`/courses/${courseId}/enroll-student`, { studentId })
  },
  enrollStudents(courseId, studentIds) {
    return apiClient.post(`/courses/${courseId}/enroll-students`, { studentIds })
  },
  enrollSelf(courseId) {
    return apiClient.post(`/courses/${courseId}/enroll`)
  },
  removeStudent(courseId, studentId) {
    return apiClient.delete(`/courses/${courseId}/students/${studentId}`)
  },
  getQRCode(courseId) {
    return apiClient.get(`/courses/${courseId}/qr-code`)
  },
  getCourseGroups(courseId) {
    return apiClient.get(`/courses/${courseId}/groups`)
  },
  getGroup(groupId) {
    return apiClient.get(`/courses/groups/${groupId}`)
  },
  createGroup(groupData) {
    return apiClient.post('/courses/groups', groupData)
  },
  updateGroup(groupId, groupData) {
    return apiClient.patch(`/courses/groups/${groupId}`, groupData)
  },
  deleteGroup(groupId) {
    return apiClient.delete(`/courses/groups/${groupId}`)
  },
  removeStudentFromGroup(groupId, studentId) {
    return apiClient.delete(`/courses/groups/${groupId}/students/${studentId}`)
  }
}

// Ensure all services are exported
const apiServices = {
  authService,
  userService,
  projectService,
  agentService,
  updateService,
  reportService,
  messageService,
  milestoneService,
  evaluationService,
  projectGroupService,
  courseService
}

export default apiServices