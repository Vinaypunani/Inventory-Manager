import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-6">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</Link>
    </div>
  );
};

export default NotFound; 