import { useMutation } from "react-query"
import { api } from "../utils/api"
import { toast } from "react-hot-toast"

export function useImageUpload() {
  const { mutateAsync: uploadImage, isLoading } = useMutation(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file")
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB")
      }

      const formData = new FormData()
      formData.append("image", file)

      // Use the correct endpoint
      const response = await api.post("/upload-image"", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (!response.data.url) {
        throw new Error("Invalid response from server")
      }

      return response.data.url
    },
    {
      onError: (error: any) => {
        console.error("Failed to upload image:", error)
        toast.error(error.response?.data?.message || error.message || "Failed to upload image")
      },
    },
  )

  return {
    uploadImage,
    isLoading,
  }
}

