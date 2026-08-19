'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application error:', error);
  }, [error]);

  // Check if it's the Server Action missing error due to deployments
  const isServerActionError = 
    error.message?.includes('Failed to find Server Action') || 
    error.message?.includes('older or newer deployment');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <h2 className="text-3xl font-bold mb-4 tracking-tight">
        {isServerActionError ? 'Application Updated' : 'Something went wrong!'}
      </h2>
      <p className="mb-8 text-gray-600 max-w-md text-lg">
        {isServerActionError 
          ? 'A new version of the site has been deployed. Please refresh the page to continue.' 
          : 'An unexpected error has occurred. Please try again or refresh the page.'}
      </p>
      
      <div className="flex gap-4">
        {isServerActionError ? (
          <button
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            onClick={() => reset()}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
