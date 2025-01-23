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
    async (template: Omit<CreateTemplateInput, "layout">) => {
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
        const message = error.response?.data?.message || "Failed to save template"
        const details = error.response?.data?.details

        if (details) {
          Object.values(details).forEach((detail) => {
            if (detail) toast.error(detail as string)
          })
        } else {
          toast.error(message)
        }

        throw error
      },
    },
  )

  const { mutateAsync: deleteTemplate, isLoading: isDeleting } = useMutation(
    async (templateId: string) => {
      const response = await api.delete(`/email/template/${templateId}`)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success("Template deleted successfully")
        queryClient.invalidateQueries("templates")
      },
      onError: (error: any) => {
        console.error("Failed to delete template:", error)
        toast.error(error.response?.data?.message || "Failed to delete template")
      },
    },
  )

  return {
    templates,
    isTemplatesLoading,
    saveTemplate,
    isSaving,
    deleteTemplate,
    isDeleting,
  }
}

