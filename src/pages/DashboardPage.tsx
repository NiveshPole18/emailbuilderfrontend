import React, { useState } from "react"
import { Link } from "react-router-dom"
import { PlusIcon } from "@heroicons/react/24/outline"
import { useEmailTemplate } from "../hooks/useEmailTemplate.ts"
import LoadingState from "../components/LoadingState.tsx"
import { Button } from "../components/ui/Button.tsx"

export default function DashboardPage() {
  const { templates = [], isTemplatesLoading } = useEmailTemplate()

  if (isTemplatesLoading) {
    return <LoadingState />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="mt-2 text-sm text-gray-700">Create and manage your email templates</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/templates/new">
            <Button>
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create Template
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {templates.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow-sm px-4 py-12">
            <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first template</p>
            <div className="mt-6">
              <Link to="/templates/new">
                <Button>
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create New Template
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div key={template._id} className="relative bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 truncate">{template.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Created {new Date(template.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <Link
                    to={`/templates/${template._id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

