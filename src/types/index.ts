export interface User {
    id: string
    name: string
    email: string
  }
  
  export interface EmailTemplate {
    id?: string
    name: string
    layout: string
    config: {
      title: string
      content: string
      imageUrl: string
      footer: string
      styles: {
        titleColor: string
        contentColor: string
        backgroundColor: string
        fontSize: string
      }
    }
    createdAt?: string
    updatedAt?: string
  }
  
  export interface Section {
    id: string
    label: string
    type: "text" | "image"
  }
  
  export interface AuthResponse {
    token: string
    user: User
  }
  
  export interface ApiError {
    message: string
    errors?: string[]
  }
  
  