'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CreditChecker = ({ resumeId, onCreditCheck, children }) => {
  const [checking, setChecking] = useState(false);
  const [creditInfo, setCreditInfo] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const checkCredits = async () => {
    if (!resumeId || !user?.email) return;

    setChecking(true);
    setError(null);

    try {
      const response = await fetch(`/api/payments/check-credits/${resumeId}/${user.email}`);
      if (!response.ok) throw new Error('Failed to check credits');
      
      const data = await response.json();
      setCreditInfo(data);
      
      if (onCreditCheck) {
        onCreditCheck(data);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  const getCreditStatusIcon = () => {
    if (!creditInfo) return '❓';
    return creditInfo.can_view ? '✅' : '❌';
  };

  const getCreditStatusColor = () => {
    if (!creditInfo) return 'text-gray-600';
    return creditInfo.can_view ? 'text-green-600' : 'text-red-600';
  };

  const getCreditStatusText = () => {
    if (!creditInfo) return 'Check Credits';
    return creditInfo.can_view ? 'Access Granted' : 'Access Denied';
  };

  const getCreditStatusDescription = () => {
    if (!creditInfo) return 'Click to check if you can view this resume';
    
    if (creditInfo.credits_required === 0) {
      return 'Free access - Company internal resume';
    }
    
    if (creditInfo.can_view) {
      return `Will consume ${creditInfo.credits_required} credit(s). Available: ${creditInfo.available_credits}`;
    } else {
      return `Requires ${creditInfo.credits_required} credit(s). Available: ${creditInfo.available_credits}`;
    }
  };

  return (
    <div className="w-full">
      {/* Credit Check Button */}
      <div className="mb-4">
        <button
          onClick={checkCredits}
          disabled={checking}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
            checking
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {checking ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Checking Credits...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-2">💰</span>
              {getCreditStatusText()}
            </div>
          )}
        </button>
      </div>

      {/* Credit Status Display */}
      {creditInfo && (
        <div className={`mb-4 p-4 rounded-lg border ${
          creditInfo.can_view 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <span className="text-2xl mr-3">{getCreditStatusIcon()}</span>
            <div className="flex-1">
              <h4 className={`font-semibold ${getCreditStatusColor()}`}>
                {getCreditStatusText()}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {getCreditStatusDescription()}
              </p>
              
              {/* Credit Balance Info */}
              {creditInfo.available_credits !== undefined && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Available:</span>
                      <span className="ml-2 font-semibold text-green-600">
                        {creditInfo.available_credits}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-semibold">
                        {creditInfo.total_credits}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Used:</span>
                      <span className="ml-2 font-semibold">
                        {creditInfo.used_credits}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">Error: {error}</p>
          <button 
            onClick={checkCredits}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Children (Resume content) */}
      {children}
    </div>
  );
};

export default CreditChecker;
