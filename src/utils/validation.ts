export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const validatePassword = (password: string): string[] => {
    const errors: string[] = []
  
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long")
    }
  
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
  
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
  
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number")
    }
  
    return errors
  }
  
  export const validateTemplateConfig = (config: any): string[] => {
    const errors: string[] = []
  
    if (!config.title?.trim()) {
      errors.push("Title is required")
    }
  
    if (!config.content?.trim()) {
      errors.push("Content is required")
    }
  
    if (!config.footer?.trim()) {
      errors.push("Footer is required")
    }
  
    return errors
  }
  
  