import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg text-gray-700 mb-4">
        Sorry, an unexpected error has occurred.
      </p>
      <div className="text-gray-500 mb-8 bg-gray-200 p-4 rounded overflow-auto text-left">
        <i>{error.statusText || error.message || 'Unknown Error'}</i>
      </div>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default ErrorPage;