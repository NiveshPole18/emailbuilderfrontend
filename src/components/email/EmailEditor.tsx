import React, { useState, ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useEmailTemplate } from "../../hooks/useEmailTemplate.ts"
import { useImageUpload } from "../../hooks/useImageUpload.ts"
import { Button } from "../ui/Button.tsx"
import { Input } from "../ui/Input.tsx"
import { Textarea } from "../ui/Textarea.tsx"
import ColorPicker from "./ColorPicker.tsx"
import Preview from "./Preview.tsx"

export default function EmailEditor() {
  const navigate = useNavigate()
  const { saveTemplate, isSaving } = useEmailTemplate()
  const { uploadImage, isLoading: isUploading } = useImageUpload()

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

  const sections = [
    { id: "title", label: "Email Title", type: "text" },
    { id: "content", label: "Email Content", type: "textarea" },
    { id: "image", label: "Header Image", type: "image" },
    { id: "footer", label: "Footer Text", type: "text" },
  ]

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file)
      setConfig({ ...config, imageUrl })
      toast.success("Image uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload image")
    }
  }

  const handleSave = async () => {
    if (isSaving) return; // Prevent double submission

    try {
      await saveTemplate({
        name,
        config,
        layout: "default-layout",
      });
      navigate("/templates"); // Navigate after successful save
    } catch (error) {
      console.error('Save failed:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate"
              placeholder="Template Name"
            />
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button variant="outline" className="ml-3" onClick={() => navigate("/templates")}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="ml-3" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Editor Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Email Content</h2>

            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{section.label}</label>

                  {section.type === "image" ? (
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary-50 file:text-primary-700
                          hover:file:bg-primary-100"
                        disabled={isUploading}
                      />
                    </div>
                  ) : section.type === "textarea" ? (
                    <Textarea
                      value={config[section.id as keyof typeof config] as string}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          [section.id]: e.target.value,
                        })
                      }
                      rows={6}
                      className="mt-1"
                      placeholder={`Enter ${section.label.toLowerCase()}`}
                    />
                  ) : (
                    <Input
                      type="text"
                      value={config[section.id as keyof typeof config] as string}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          [section.id]: e.target.value,
                        })
                      }
                      className="mt-1"
                      placeholder={`Enter ${section.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}

              <div className="border-t pt-6 mt-6">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
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

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Preview</h2>
            <Preview config={config} />
          </div>
        </div>
      </div>
    </div>
  )
}
