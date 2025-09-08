'use client';

import { useState } from 'react';
import CreditChecker from './CreditChecker';

const ResumeViewerWithCredits = ({ resumeId, resumeData }) => {
  const [showResume, setShowResume] = useState(false);
  const [creditInfo, setCreditInfo] = useState(null);

  const handleCreditCheck = (info) => {
    setCreditInfo(info);
    
    if (info.can_view) {
      setShowResume(true);
    }
  };

  const handleViewResume = async () => {
    if (!creditInfo || !creditInfo.can_view) return;

    try {
      // Call the backend API to view the resume (consumes 1 credit)
      const response = await fetch('/api/payments/view-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resumeId,
          hr_email: 'hr@company.com' // Get from auth context
        })
      });

      if (response.status === 402) {
        // Insufficient credits
        alert('Insufficient credits to view this resume');
        return;
      }

      if (!response.ok) throw new Error('Failed to view resume');
      
      const data = await response.json();
      console.log('Resume viewed successfully:', data);
      
      // Resume is now visible and credit has been consumed
      setShowResume(true);
      
    } catch (error) {
      console.error('Error viewing resume:', error);
      alert('Failed to view resume. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Resume Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Details
          </h1>
          <p className="text-gray-600">
            Resume ID: {resumeId}
          </p>
        </div>

        {/* Credit Check Section */}
        <div className="p-6 border-b border-gray-200">
          <CreditChecker 
            resumeId={resumeId} 
            onCreditCheck={handleCreditCheck}
          />
        </div>

        {/* Resume Content */}
        {showResume && creditInfo?.can_view ? (
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-green-600 text-2xl mr-3">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800">
                    Resume Access Granted
                  </h3>
                  <p className="text-green-700 text-sm">
                    {creditInfo.credits_required > 0 
                      ? `1 credit will be consumed. Available: ${creditInfo.available_credits}`
                      : 'Free access - Company internal resume'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{resumeData?.name || 'John Doe'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{resumeData?.email || 'john@example.com'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{resumeData?.phone || '+91 98765 43210'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-gray-900">{resumeData?.experience || '5 years'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData?.skills?.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  )) || (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      JavaScript, React, Node.js, Python
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Education
                </h3>
                <div className="space-y-2">
                  {resumeData?.education?.map((edu, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                    </div>
                  )) || (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">Bachelor of Technology in Computer Science</p>
                      <p className="text-sm text-gray-600">ABC University • 2020</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <button
                  onClick={handleViewResume}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Full Resume
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Download PDF
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Share Resume
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Resume Preview
            </h3>
            <p className="text-gray-600">
              Check your credits above to view the full resume details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeViewerWithCredits;
