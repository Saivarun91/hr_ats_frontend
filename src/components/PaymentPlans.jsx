'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const PaymentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPaymentPlans();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    // Load Razorpay script if not already loaded
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => console.log('Razorpay script loaded');
      script.onerror = () => console.error('Failed to load Razorpay script');
      document.body.appendChild(script);
    }
  };

  const fetchPaymentPlans = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/payments/available-plans/`);
      if (!response.ok) throw new Error('Failed to fetch plans');
  
      const data = await response.json();
      console.log("data",data);
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };
console.log("user",user);
console.log("selectedPlan",selectedPlan);
  const handlePayment = async () => {
    if (!selectedPlan || !user) return;

    setProcessingPayment(true);
    setError(null);

    try {
      // Create Razorpay order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/payments/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          company_admin_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      const orderData = await response.json();
      
      // Wait for Razorpay script to load
      if (!window.Razorpay) {
        await new Promise(resolve => {
          const checkRazorpay = () => {
            if (window.Razorpay) {
              resolve();
            } else {
              setTimeout(checkRazorpay, 100);
            }
          };
          checkRazorpay();
        });
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
        amount: orderData.amount * 100, // Convert to paise
        currency: orderData.currency || 'INR',
        name: 'HR Resume Analysis',
        description: `Purchase ${selectedPlan.credits} credits via ${selectedPlan.name}`,
        order_id: orderData.order_id,
        handler: (response) => {
          handlePaymentSuccess(response, orderData);
        },
        prefill: {
          name: user.name || 'Company Admin',
          email: user.email,
          contact: user.phone || ''
        },
        notes: {
          plan_id: selectedPlan.id,
          company_admin: user.email,
          credits: selectedPlan.credits
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: () => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
            setProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (err) {
      setError(err.message);
      setProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (response, orderData) => {
    try {
      // Verify payment with backend
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/payments/verify-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          payment_id: orderData.payment_id
        })
      });

      if (verifyResponse.ok) {
        // Show success message
        alert('Payment successful! Credits have been added to your account.');
        
        // Refresh plans and close modal
        setShowPaymentModal(false);
        setSelectedPlan(null);
        setProcessingPayment(false);
        
        // Redirect to credits page
        window.location.href = '/company-admin/credits';
      } else {
        throw new Error('Payment verification failed');
      }
      
    } catch (err) {
      setError('Payment successful but verification failed. Please contact support.');
      setProcessingPayment(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    setProcessingPayment(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment plans...</p>
        </div>
      </div>
    );
  }

  if (error && !showPaymentModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Credit Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select a plan to purchase credits for viewing global resumes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">
                  ₹{plan.price}
                </div>
                <p className="text-blue-100">{plan.description}</p>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {plan.credits} Credits
                  </div>
                  <p className="text-gray-600">
                    {plan.credits} global resume views
                  </p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Global resume access
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Company internal resumes (free)
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Transaction history
                  </li>
                </ul>
                
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={!plan.is_active}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${
                    plan.is_active
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {plan.is_active ? 'Select Plan' : 'Currently Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Confirm Purchase
              </h2>
              
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Plan:</span>
                    <span>{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Credits:</span>
                    <span>{selectedPlan.credits}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Amount:</span>
                    <span className="text-lg font-bold text-blue-600">₹{selectedPlan.price}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  disabled={processingPayment}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {processingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPlans;
