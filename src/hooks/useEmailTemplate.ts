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
      // Ensure all required fields are present and properly formatted
      const payload = {
        name: template.name.trim(),
        config: {
          title: template.config.title.trim(),
          content: template.config.content.trim(),
          imageUrl: template.config.imageUrl || "",
          footer: template.config.footer || "",
          styles: {
            titleColor: template.config.styles.titleColor || "#000000",
            contentColor: template.config.styles.contentColor || "#333333",
            backgroundColor: template.config.styles.backgroundColor || "#ffffff",
            fontSize: template.config.styles.fontSize || "16px",
          },
        },
      }

      const response = await api.post("/email/template", payload)
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

  return {
    templates,
    isTemplatesLoading,
    saveTemplate,
    isSaving,
  }
}

