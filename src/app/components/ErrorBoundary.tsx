import React from 'react';
import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router';
import { AlertTriangle, Home, RefreshCcw, ArrowLeft } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "Something went wrong";
  let errorCode = "Error";

  if (isRouteErrorResponse(error)) {
    errorCode = error.status.toString();
    if (error.status === 404) {
      errorMessage = "Oops! The page you're looking for doesn't exist.";
    } else if (error.status === 401) {
      errorMessage = "You aren't authorized to see this page.";
    } else if (error.status === 503) {
      errorMessage = "Looks like our API is down.";
    } else if (error.status === 418) {
      errorMessage = "🫖 I'm a teapot";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      
      <h1 className="text-6xl font-black text-gray-900 mb-2">{errorCode}</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{errorMessage}</h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        We apologize for the inconvenience. Please try refreshing the page or go back to the home screen.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCcw className="w-5 h-5" />
          Refresh Page
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-semibold text-white hover:bg-blue-700 transition-colors shadow-md"
        >
          <Home className="w-5 h-5" />
          Go Home
        </button>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-8 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Go back to previous page
      </button>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 bg-gray-900 rounded-lg text-left overflow-auto max-w-full">
          <p className="text-red-400 font-mono text-xs mb-2">Internal Error Log:</p>
          <pre className="text-gray-300 font-mono text-[10px] whitespace-pre-wrap">
            {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
