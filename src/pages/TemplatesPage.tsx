import React from 'react';
import { Link } from 'react-router-dom';
import { useEmailTemplate } from '../hooks/useEmailTemplate.ts';
import LoadingState from '../components/LoadingState.tsx';

export default function TemplatesPage() {
  const { templates = [], isTemplatesLoading } = useEmailTemplate();

  if (isTemplatesLoading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Your Templates</h1>
        <div className="mt-6">
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
      </div>
    </div>
  );
}
