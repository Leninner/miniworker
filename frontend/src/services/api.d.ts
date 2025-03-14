declare module '@/services/api' {
  /**
   * API Service for all API endpoints
   */
  interface AuthService {
    login(credentials: { email: string; password: string }): Promise<any>;
    register(userData: any): Promise<any>;
    getProfile(): Promise<any>;
  }

  interface UserService {
    getUsers(): Promise<any>;
    getUser(id: string): Promise<any>;
    updateUser(id: string, userData: any): Promise<any>;
    updateUserStatus(id: string, statusData: { status: string }): Promise<any>;
  }

  interface ProjectService {
    getProjects(params?: any): Promise<any>;
    getAllProjects(): Promise<any>;
    getProject(id: string): Promise<any>;
    createProject(projectData: any): Promise<any>;
    updateProject(id: string, projectData: any): Promise<any>;
    deleteProject(id: string): Promise<any>;
    submitProject(id: string): Promise<any>;
    gradeProject(id: string, gradeData: any): Promise<any>;
  }

  interface MessageService {
    getMessages(projectId: string): Promise<any>;
    sendMessage(projectId: string, message: any): Promise<any>;
  }

  interface AgentService {
    getAgents(params?: any): Promise<any>;
    getAgent(id: string): Promise<any>;
    createAgent(agentData: any): Promise<any>;
    updateAgent(id: string, agentData: any): Promise<any>;
    deleteAgent(id: string): Promise<any>;
    getAgentGreeting(agentId: string): Promise<any>;
    getAgentFeedback(agentId: string, message: string): Promise<any>;
    evaluateSubmission(agentId: string, submission: any): Promise<any>;
    getNextSteps(agentId: string, projectId: string): Promise<any>;
  }

  interface UpdateService {
    getUpdates(projectId: string): Promise<any>;
    createUpdate(projectId: string, updateData: any): Promise<any>;
  }

  interface ReportService {
    getProjectReport(projectId: string, options?: any): Promise<any>;
    getEvaluationReport(evaluationId: string, options?: any): Promise<any>;
    getStudentPerformanceReport(studentId: string, options?: any): Promise<any>;
  }

  interface MilestoneService {
    getMilestones(projectId: string): Promise<any>;
    getMilestone(projectId: string, milestoneId: string): Promise<any>;
    createMilestone(projectId: string, milestoneData: any): Promise<any>;
    updateMilestone(projectId: string, milestoneId: string, milestoneData: any): Promise<any>;
    submitMilestone(projectId: string, milestoneId: string, submissionData: any): Promise<any>;
  }

  interface EvaluationService {
    getEvaluations(projectId: string): Promise<any>;
    getEvaluation(projectId: string, evaluationId: string): Promise<any>;
    createEvaluation(projectId: string, evaluationData: any): Promise<any>;
    updateEvaluation(projectId: string, evaluationId: string, evaluationData: any): Promise<any>;
    analyzeSubmission(projectId: string, milestoneId: string): Promise<any>;
    generateRecommendations(projectId: string, evaluationId: string): Promise<any>;
    getSubmissionAnalysis(projectId: string, milestoneId: string): Promise<any>;
  }

  interface ProjectGroupService {
    getAllProjectGroups(): Promise<any>;
    getProjectGroup(id: string): Promise<any>;
    getManagedGroups(): Promise<any>;
    createGroup(groupData: any): Promise<any>;
    updateGroup(id: string, groupData: any): Promise<any>;
    addMember(groupId: string, userId: string): Promise<any>;
    removeMember(groupId: string, userId: string): Promise<any>;
    assignProject(groupId: string, projectId: string): Promise<any>;
    deleteGroup(id: string): Promise<any>;
  }

  interface CourseService {
    getCourses(params?: any): Promise<any>;
    getCourse(id: string): Promise<any>;
    createCourse(courseData: any): Promise<any>;
    updateCourse(id: string, courseData: any): Promise<any>;
    deleteCourse(id: string): Promise<any>;
    enrollStudent(courseId: string, studentId: string): Promise<any>;
    enrollStudents(courseId: string, studentIds: string[]): Promise<any>;
    enrollSelf(courseId: string): Promise<any>;
    removeStudent(courseId: string, studentId: string): Promise<any>;
    getQRCode(courseId: string): Promise<any>;
    getCourseGroups(courseId: string): Promise<any>;
    getGroup(groupId: string): Promise<any>;
    createGroup(groupData: any): Promise<any>;
    updateGroup(groupId: string, groupData: any): Promise<any>;
    deleteGroup(groupId: string): Promise<any>;
    removeStudentFromGroup(groupId: string, studentId: string): Promise<any>;
  }

  interface ApiServices {
    authService: AuthService;
    userService: UserService;
    projectService: ProjectService;
    agentService: AgentService;
    updateService: UpdateService;
    reportService: ReportService;
    messageService: MessageService;
    milestoneService: MilestoneService;
    evaluationService: EvaluationService;
    projectGroupService: ProjectGroupService;
    courseService: CourseService;
  }

  const apiServices: ApiServices;
  
  export default apiServices;
} 