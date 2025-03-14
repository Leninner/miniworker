import { defineStore } from 'pinia'
import type { Course, CourseGroup, CourseQRCode } from '@/types'
import apiServices from '@/services/api'
import { useAuthStore } from './auth'

interface CourseState {
  courses: Course[]
  selectedCourse: Course | null
  courseGroups: CourseGroup[]
  selectedGroup: CourseGroup | null
  qrCode: CourseQRCode | null
  loading: boolean
  error: string | null
}

export const useCourseStore = defineStore('course', {
  state: (): CourseState => ({
    courses: [],
    selectedCourse: null,
    courseGroups: [],
    selectedGroup: null,
    qrCode: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getCourseById: (state) => (id: string) => {
      return state.courses.find(course => course.id === id) || null
    },
    getGroupById: (state) => (id: string) => {
      return state.courseGroups.find(group => group.id === id) || null
    },
    professorCourses: (state) => {
      const authStore = useAuthStore()
      return state.courses.filter(course => course.professorId === authStore.user?.id)
    },
    enrolledCourses: (state) => {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      return state.courses.filter(course => 
        course.students?.some(student => student.id === userId)
      )
    }
  },
  
  actions: {
    async fetchCourses() {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.getCourses()
        this.courses = response.data
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch courses'
        console.error('Error fetching courses:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchCourse(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.getCourse(id)
        this.selectedCourse = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || `Failed to fetch course with ID ${id}`
        console.error(`Error fetching course ${id}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async createCourse(courseData: Partial<Course>) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.createCourse(courseData)
        this.courses.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Failed to create course'
        console.error('Error creating course:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async updateCourse(id: string, courseData: Partial<Course>) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.updateCourse(id, courseData)
        
        // Update the course in the courses array
        const index = this.courses.findIndex(course => course.id === id)
        if (index !== -1) {
          this.courses[index] = { ...this.courses[index], ...response.data }
        }
        
        // Update selected course if it's the one being updated
        if (this.selectedCourse && this.selectedCourse.id === id) {
          this.selectedCourse = { ...this.selectedCourse, ...response.data }
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.message || `Failed to update course with ID ${id}`
        console.error(`Error updating course ${id}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async deleteCourse(id: string) {
      this.loading = true
      this.error = null
      
      try {
        await apiServices.courseService.deleteCourse(id)
        
        // Remove the course from the courses array
        this.courses = this.courses.filter(course => course.id !== id)
        
        // Clear selected course if it's the one being deleted
        if (this.selectedCourse && this.selectedCourse.id === id) {
          this.selectedCourse = null
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || `Failed to delete course with ID ${id}`
        console.error(`Error deleting course ${id}:`, error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    async enrollStudent(courseId: string, studentId: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.enrollStudent(courseId, studentId)
        
        // Update the course in the courses array
        const index = this.courses.findIndex(course => course.id === courseId)
        if (index !== -1 && response.data.students) {
          this.courses[index].students = response.data.students
        }
        
        // Update selected course if it's the one being updated
        if (this.selectedCourse && this.selectedCourse.id === courseId) {
          this.selectedCourse.students = response.data.students
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.message || `Failed to enroll student in course with ID ${courseId}`
        console.error(`Error enrolling student in course ${courseId}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async enrollSelf(courseId: string) {
      this.loading = true
      this.error = null
      const authStore = useAuthStore()
      
      try {
        const response = await apiServices.courseService.enrollSelf(courseId)
        
        // Update the course in the courses array
        const index = this.courses.findIndex(course => course.id === courseId)
        if (index !== -1 && response.data.students) {
          this.courses[index].students = response.data.students
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.message || `Failed to enroll in course with ID ${courseId}`
        console.error(`Error enrolling in course ${courseId}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async removeStudent(courseId: string, studentId: string) {
      this.loading = true
      this.error = null
      
      try {
        await apiServices.courseService.removeStudent(courseId, studentId)
        
        // Update the course in the courses array
        const index = this.courses.findIndex(course => course.id === courseId)
        if (index !== -1 && this.courses[index].students) {
          this.courses[index].students = this.courses[index].students!.filter(
            student => student.id !== studentId
          )
        }
        
        // Update selected course if it's the one being updated
        if (this.selectedCourse && this.selectedCourse.id === courseId && this.selectedCourse.students) {
          this.selectedCourse.students = this.selectedCourse.students.filter(
            student => student.id !== studentId
          )
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || `Failed to remove student from course with ID ${courseId}`
        console.error(`Error removing student from course ${courseId}:`, error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    async getQRCode(courseId: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.getQRCode(courseId)
        this.qrCode = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || `Failed to get QR code for course with ID ${courseId}`
        console.error(`Error getting QR code for course ${courseId}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // Group management
    async fetchCourseGroups(courseId: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.getCourseGroups(courseId)
        this.courseGroups = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || `Failed to fetch groups for course with ID ${courseId}`
        console.error(`Error fetching groups for course ${courseId}:`, error)
        return []
      } finally {
        this.loading = false
      }
    },
    
    async fetchGroup(groupId: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.getGroup(groupId)
        this.selectedGroup = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || `Failed to fetch group with ID ${groupId}`
        console.error(`Error fetching group ${groupId}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async createGroup(groupData: Partial<CourseGroup>) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.createGroup(groupData)
        this.courseGroups.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Failed to create group'
        console.error('Error creating group:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async updateGroup(groupId: string, groupData: Partial<CourseGroup>) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiServices.courseService.updateGroup(groupId, groupData)
        
        // Update the group in the groups array
        const index = this.courseGroups.findIndex(group => group.id === groupId)
        if (index !== -1) {
          this.courseGroups[index] = { ...this.courseGroups[index], ...response.data }
        }
        
        // Update selected group if it's the one being updated
        if (this.selectedGroup && this.selectedGroup.id === groupId) {
          this.selectedGroup = { ...this.selectedGroup, ...response.data }
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.message || `Failed to update group with ID ${groupId}`
        console.error(`Error updating group ${groupId}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async deleteGroup(groupId: string) {
      this.loading = true
      this.error = null
      
      try {
        await apiServices.courseService.deleteGroup(groupId)
        
        // Remove the group from the groups array
        this.courseGroups = this.courseGroups.filter(group => group.id !== groupId)
        
        // Clear selected group if it's the one being deleted
        if (this.selectedGroup && this.selectedGroup.id === groupId) {
          this.selectedGroup = null
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || `Failed to delete group with ID ${groupId}`
        console.error(`Error deleting group ${groupId}:`, error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    async removeStudentFromGroup(groupId: string, studentId: string) {
      this.loading = true
      this.error = null
      
      try {
        await apiServices.courseService.removeStudentFromGroup(groupId, studentId)
        
        // Update the group in the groups array
        const index = this.courseGroups.findIndex(group => group.id === groupId)
        if (index !== -1 && this.courseGroups[index].students) {
          this.courseGroups[index].students = this.courseGroups[index].students!.filter(
            student => student.id !== studentId
          )
        }
        
        // Update selected group if it's the one being updated
        if (this.selectedGroup && this.selectedGroup.id === groupId && this.selectedGroup.students) {
          this.selectedGroup.students = this.selectedGroup.students.filter(
            student => student.id !== studentId
          )
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || `Failed to remove student from group with ID ${groupId}`
        console.error(`Error removing student from group ${groupId}:`, error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    resetState() {
      this.courses = []
      this.selectedCourse = null
      this.courseGroups = []
      this.selectedGroup = null
      this.qrCode = null
      this.loading = false
      this.error = null
    }
  }
}) 