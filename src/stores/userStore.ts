import { defineStore } from "pinia"
import { ref } from "vue"

interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
}

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)

  // Initialize from localStorage if available
  const initializeFromStorage = () => {
    const storedUser = localStorage.getItem("user")
    const storedLoginState = localStorage.getItem("isLoggedIn")

    if (storedUser && storedLoginState === "true") {
      user.value = JSON.parse(storedUser)
      isLoggedIn.value = true
    }
  }

  // Call initialization
  initializeFromStorage()

  const login = () => {
    // In a real app, this would come from the API
    user.value = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "Admin",
    }
    isLoggedIn.value = true

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user.value))
    localStorage.setItem("isLoggedIn", "true")
  }

  const logout = () => {
    user.value = null
    isLoggedIn.value = false

    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
  }
})
