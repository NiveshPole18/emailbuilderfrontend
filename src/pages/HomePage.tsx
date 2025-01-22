import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Email Builder</h1>
      <Link to="/templates">
        <Button>View Templates</Button>
      </Link>
    </div>
  );
}

