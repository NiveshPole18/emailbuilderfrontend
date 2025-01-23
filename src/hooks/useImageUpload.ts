import { useMutation } from "react-query"
import { api } from "../utils/api"
import { toast } from "react-hot-toast"

export function useImageUpload() {
  const { mutateAsync: uploadImage, isLoading } = useMutation(
    async (file: File) => {
      const formData = new FormData()
      formData.append("image", file)

      const response = await api.post("/email/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data.imageUrl
    },
    {
      onError: (error: any) => {
        console.error("Failed to upload image:", error)
        toast.error(error.response?.data?.message || "Failed to upload image")
      },
    },
  )

  return {
    uploadImage,
    isLoading,
  }
}

