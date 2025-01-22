import { useState } from 'react';
import { api } from '../utils/api.ts'; // Ensure this points to the production URL

export const useImageUpload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload', formData); // Ensure this matches your upload endpoint
      return response.data.imageUrl; // Return the image URL from the response
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadImage, isLoading };
};

