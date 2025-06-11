'use client';

import Link from 'next/link';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full">
                        <FaExclamationTriangle className="text-red-500 text-4xl" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>

                <p className="text-gray-600 mb-6">
                    You do not have permission to access this page. This area is restricted to administrators only.
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center"
                    >
                        <FaHome className="mr-2" />
                        Go to Homepage
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center justify-center"
                    >
                        <FaArrowLeft className="mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}