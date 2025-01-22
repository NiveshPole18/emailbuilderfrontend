import React from 'react';
import { useQuery } from "react-query"
import { api } from "../../utils/api.ts"
import type { EmailTemplate } from "../../types"
import { Button } from "../ui/Button.tsx"
import LoadingState from "../LoadingState.tsx"

export default function TemplateList() {
  const { data: templates, isLoading } = useQuery<EmailTemplate[]>("templates", async () => {
    const response = await api.get("/email/templates")
    return response.data
  })

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {templates?.map((template) => (
          <li key={template.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary-600 truncate">{template.name}</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <Button
                    type="button"
                    className="outline text-sm py-1 px-2"
                    onClick={() => window.open(`/api/email/template/${template.id}/render`, "_blank")}
                  >
                    Preview
                  </Button>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Created {new Date(template.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

