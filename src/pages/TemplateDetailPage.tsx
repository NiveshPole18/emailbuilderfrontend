import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api.ts'; // This will now point to the production URL
import LoadingState from '../components/LoadingState.tsx'; // Optional loading state component
import { Template } from '../hooks/useEmailTemplate.ts'; // Import the Template type correctly

const TemplateDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the template ID from the URL with type
  const [template, setTemplate] = useState<Template | null>(null); // State to hold the template details
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await api.get(`/template/${id}`); // This will now use the production URL
        setTemplate(response.data); // Set the template details in state
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchTemplate(); // Call the fetch function
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await api.get(`/template/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `template-${id}.html`); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  if (isLoading) {
    return <LoadingState />; // Show loading state while fetching
  }

  if (!template) {
    return <div>Template not found.</div>; // Handle case where template is not found
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{template.name}</h1>
      <h2 className="text-lg">Layout: {template.layout}</h2>
      {template.config.imageUrl && (
        <img src={template.config.imageUrl} alt="Template Header" className="w-full h-auto" />
      )}
      <div>
        <h3 className="text-lg font-medium">Content:</h3>
        <div>{template.config.content}</div>
      </div>
      <button onClick={handleDownload} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        Download Template
      </button>
      {/* Render other template details as needed */}
    </div>
  );
};

export default TemplateDetailPage; 