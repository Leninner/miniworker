import { defineStore } from 'pinia'
import apiService from '@/services/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isProfessor: (state) => state.user?.role === 'professor',
    isStudent: (state) => state.user?.role === 'student',
  },
  
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await apiService.authService.login({ email, password })
        
        this.token = response.data.accessToken
        this.user = response.data.user
        
        localStorage.setItem('token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    async register(userData: any) {
      try {
        const response = await apiService.authService.register(userData)
        
        this.token = response.data.accessToken
        this.user = response.data.user
        
        localStorage.setItem('token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
    },
    
    initialize() {
      if (this.token) {
        this.user = JSON.parse(localStorage.getItem('user') || 'null')
      }
    }
  }
}) 