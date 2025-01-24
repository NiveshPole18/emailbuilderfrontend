import { useMutation, useQuery, useQueryClient } from "react-query"
import { api } from "../utils/api"
import { toast } from "react-hot-toast"

interface Template {
  _id: string
  name: string
  createdAt: string
  userId: string
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
}

export type CreateTemplateInput = Omit<Template, "_id" | "createdAt" | "userId">

export function useEmailTemplate() {
  const queryClient = useQueryClient()

  const { data: templates, isLoading: isTemplatesLoading } = useQuery<Template[]>(
    "templates",
    async () => {
      const response = await api.get("/email/templates")
      return response.data
    },
    {
      onError: (error: any) => {
        console.error("Failed to fetch templates:", error)
        toast.error(error.response?.data?.message || "Failed to fetch templates")
      },
    },
  )

  const { mutateAsync: saveTemplate, isLoading: isSaving } = useMutation(
    async (template: CreateTemplateInput) => {
      const response = await api.post("/email/template", template)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success("Template saved successfully")
        queryClient.invalidateQueries("templates")
      },
      onError: (error: any) => {
        console.error("Failed to save template:", error)
        toast.error(error.response?.data?.message || "Failed to save template")
      },
    },
  )

  const downloadTemplate = async (templateId: string) => {
    try {
      const response = await api.get(`/email/template/${templateId}/render`, {
        responseType: "blob",
      })

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `template-${templateId}.html`)

      // Append to html link element page
      document.body.appendChild(link)

      // Start download
      link.click()

      // Clean up and remove the link
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error("Error downloading template:", error)
      toast.error("Failed to download template")
    }
  }

  return {
    templates,
    isTemplatesLoading,
    saveTemplate,
    isSaving,
    downloadTemplate,
  }
}

