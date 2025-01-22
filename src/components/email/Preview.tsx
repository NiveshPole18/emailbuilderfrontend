import React from 'react';

interface PreviewProps {
  config: {
    title: string;
    content: string;
    imageUrl: string;
    footer: string;
    styles: {
      titleColor: string;
      contentColor: string;
      backgroundColor: string;
      fontSize: string;
    };
  };
}

const Preview: React.FC<PreviewProps> = ({ config }) => {
  return (
    <div
      className="border rounded-lg p-4"
      style={{ backgroundColor: config.styles.backgroundColor }}
    >
      {config.imageUrl && (
        <img
          src={config.imageUrl}
          alt="Header"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h1 style={{ color: config.styles.titleColor, fontSize: config.styles.fontSize }}>
        {config.title}
      </h1>
      <div
        style={{ color: config.styles.contentColor }}
        className="mt-4 whitespace-pre-wrap"
      >
        {config.content}
      </div>
      <div className="mt-8 text-sm text-gray-500">{config.footer}</div>
    </div>
  );
};

export default Preview;
