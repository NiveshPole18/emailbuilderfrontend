import { useMutation, useQuery, useQueryClient } from "react-query"
import { api } from "../utils/api.ts"
import { toast } from "react-hot-toast"

export interface Template {
  _id: string
  name: string
  createdAt: string
  userId: string
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
}

export type CreateTemplateInput = Omit<Template, "_id" | "createdAt" | "userId"> & {
  layout: string
}

export function useEmailTemplate() {
  const queryClient = useQueryClient()

  const { data: templates, isLoading: isTemplatesLoading } = useQuery<Template[]>(
    "templates",
    async () => {
      const response = await api.get("/templates")
      return response.data
    },
    {
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to fetch templates")
      },
    },
  )

  const { mutateAsync: saveTemplate, isLoading: isSaving } = useMutation(
    async (template: CreateTemplateInput) => {
      const response = await api.post("/template", template)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success("Template saved successfully")
        queryClient.invalidateQueries("templates")
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || "Failed to save template"
        toast.error(message)
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

