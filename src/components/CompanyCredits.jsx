'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CompanyCredits = () => {
  const [credits, setCredits] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.company_id) {
      fetchCompanyCredits();
      fetchTransactionHistory();
    }
  }, [user]);

  const fetchCompanyCredits = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/payments/company/${user.company_id}/credits`);
      if (!response.ok) throw new Error('Failed to fetch credits');
      console.log("response",response);
      
      const data = await response.json();
      setCredits(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/payments/company/${user.company_id}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
        return '💰';
      case 'usage':
        return '👁️';
      case 'refund':
        return '↩️';
      default:
        return '📝';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'purchase':
        return 'text-green-600 bg-green-100';
      case 'usage':
        return 'text-red-600 bg-red-100';
      case 'refund':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={fetchCompanyCredits}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Company Credits
        </h1>
        <p className="text-xl text-gray-600">
          Manage and monitor your company's credit balance
        </p>
      </div>

      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                {credits?.total_credits || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                {credits?.remaining_credits || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Used Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                {credits?.used_credits || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {credits && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Credit Usage</span>
            <span className="text-sm font-medium text-gray-700">
              {credits.remaining_credits} / {credits.total_credits}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ 
                width: `${credits.total_credits > 0 ? (credits.remaining_credits / credits.total_credits) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {credits.remaining_credits} credits remaining
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transaction History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Credit Usage Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {transactions.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="flex items-center text-sm">
                        <span className="mr-2">{getTransactionIcon(tx.type)}</span>
                        <span className="text-gray-600">{tx.description}</span>
                        <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                          tx.credits > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                        }`}>
                          {tx.credits > 0 ? '+' : ''}{tx.credits}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => window.location.href = '/company-admin/payment-plans'}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Purchase More Credits
                    </button>
                    <button
                      onClick={() => window.location.href = '/company-admin/hr-users'}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Manage HR Users
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Transaction History
              </h3>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">📝</span>
                  <p className="text-gray-500 mt-2">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTransactionIcon(tx.type)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{tx.description}</p>
                          <p className="text-sm text-gray-500">
                            {tx.hr_user && `HR: ${tx.hr_user}`}
                            {tx.resume_id && ` • Resume: ${tx.resume_id}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getTransactionColor(tx.type)
                        }`}>
                          {tx.credits > 0 ? '+' : ''}{tx.credits} credits
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Credit Usage Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          How Credits Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <strong>Company Internal Resumes:</strong> Free access
          </div>
          <div>
            <strong>Global Resumes:</strong> 1 credit per view
          </div>
          <div>
            <strong>Credits are shared:</strong> Across all HR users in your company
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCredits;
