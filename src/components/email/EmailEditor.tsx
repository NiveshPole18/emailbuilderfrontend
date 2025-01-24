import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useEmailTemplate } from "../../hooks/useEmailTemplate"
import { useImageUpload } from "../../hooks/useImageUpload"
import ColorPicker from "./ColorPicker"
import Preview from "./Preview"
import LoadingState from "../LoadingState"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"

export default function EmailEditor() {
  const navigate = useNavigate()
  const { saveTemplate, isSaving } = useEmailTemplate()
  const { uploadImage, isLoading: isUploading } = useImageUpload()
  const [isSaveAttempted, setIsSaveAttempted] = useState(false)

  const [name, setName] = useState("Untitled Template")
  const [config, setConfig] = useState({
    title: "Welcome to our Newsletter",
    content: "This is the main content of your email.",
    imageUrl: "",
    footer: "© 2024 Your Company",
    styles: {
      titleColor: "#000000",
      contentColor: "#333333",
      backgroundColor: "#ffffff",
      fontSize: "16px",
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file)
      setConfig({ ...config, imageUrl })
      toast.success("Image uploaded successfully")
    } catch (error) {
      // Error handling is done in the hook
      console.error("Upload failed:", error)
    }
  }

  const validateForm = () => {
    const errors: string[] = []

    if (!name.trim()) errors.push("Template name is required")
    if (!config.title.trim()) errors.push("Email title is required")
    if (!config.content.trim()) errors.push("Email content is required")

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error))
      return false
    }

    return true
  }

  const handleSave = async () => {
    setIsSaveAttempted(true)

    if (!validateForm()) {
      return
    }

    try {
      await saveTemplate({
        name,
        config,
      })
      navigate("/templates")
    } catch (error) {
      console.error("Save failed:", error)
      // Error handling is done in the hook
    }
  }

  if (isSaving) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate ${
                isSaveAttempted && !name.trim() ? "border-red-500" : ""
              }`}
              placeholder="Template Name"
            />
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button variant="outline" onClick={() => navigate("/templates")} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Email Content</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Title</label>
                <Input
                  type="text"
                  value={config.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      title: e.target.value,
                    })
                  }
                  className={`mt-1 ${isSaveAttempted && !config.title.trim() ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Content</label>
                <Textarea
                  value={config.content}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      content: e.target.value,
                    })
                  }
                  rows={6}
                  className={`mt-1 ${isSaveAttempted && !config.content.trim() ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Header Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                  disabled={isUploading}
                />
                {isUploading && <span className="mt-2 text-sm text-gray-500">Uploading...</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Footer Text</label>
                <Input
                  type="text"
                  value={config.footer}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      footer: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Styling</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <ColorPicker
                    label="Title Color"
                    color={config.styles.titleColor}
                    onChange={(color) =>
                      setConfig({
                        ...config,
                        styles: { ...config.styles, titleColor: color },
                      })
                    }
                  />
                  <ColorPicker
                    label="Content Color"
                    color={config.styles.contentColor}
                    onChange={(color) =>
                      setConfig({
                        ...config,
                        styles: { ...config.styles, contentColor: color },
                      })
                    }
                  />
                  <ColorPicker
                    label="Background Color"
                    color={config.styles.backgroundColor}
                    onChange={(color) =>
                      setConfig({
                        ...config,
                        styles: { ...config.styles, backgroundColor: color },
                      })
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Font Size</label>
                    <select
                      value={config.styles.fontSize}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          styles: { ...config.styles, fontSize: e.target.value },
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="14px">Small</option>
                      <option value="16px">Medium</option>
                      <option value="20px">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Preview</h2>
            <Preview config={config} />
          </div>
        </div>
      </div>
    </div>
  )
}

