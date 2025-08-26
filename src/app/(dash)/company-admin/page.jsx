"use client";
import Protected from "@/components/Protected";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function CompanyAdminDashboard() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  
  useEffect(() => {
    fetchCompanies();
    if (user?.company_id) {
      fetchCompanyResumes();
    }
  }, [user?.company_id]);

  const fetchCompanies = async () => {
    try {
      const data = await api.listCompanies();
      setCompanies(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
    }
  };

  const fetchCompanyResumes = async () => {
    if (!user?.company_id) return;
    
    try {
      setResumesLoading(true);
      const data = await api.getCompanyResumes(user.company_id);
      setResumes(data.resumes || []);
    } catch (e) {
      console.error("Error fetching company resumes:", e);
    } finally {
      setResumesLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  // Filter companies to show only the company admin's company
  const userCompany = companies.companies?.find(c => c._id === user?.company_id || c.id === user?.company_id);

  return (
    <Protected requiredRole="company_admin">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Company Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage {userCompany?.name || "your company"} and HR users
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={async () => {
                  const name = prompt("Enter HR name:");
                  if (!name) return;
                  
                  const email = prompt("Enter HR email:");
                  if (!email) return;
                  
                  const password = prompt("Enter HR password:");
                  if (!password) return;
                  
                  try {
                    const response = await api.addHR({
                      name,
                      email,
                      password,
                      company_id: user.company_id
                    });
                    
                    alert(`HR User created successfully!\n\nName: ${response.hr.name}\nEmail: ${response.hr.email}\nCompany: ${response.hr.company_name}`);
                    
                    // Refresh the page to show updated data
                    window.location.reload();
                  } catch (error) {
                    alert(`Error creating HR user: ${error.message}`);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Add HR User
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white rounded-xl p-1 mb-8 shadow-sm">
            <button
              onClick={() => setActiveTab('company')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'company'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Company Details
            </button>
            <button
              onClick={() => setActiveTab('resumes')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'resumes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Company Resumes ({resumes.length})
            </button>
          </div>
          
          {err && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800">{err}</span>
              </div>
            </div>
          )}

          {/* Company Details Tab */}
          {activeTab === 'company' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : userCompany ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold text-2xl">
                        {userCompany.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{userCompany.name}</h2>
                      <div className="text-lg text-gray-600 mb-4">
                        {userCompany.industry} • {userCompany.location}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{userCompany.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Company Code:</span>
                        <span className="font-mono font-semibold text-gray-900">{userCompany.company_code}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Email:</span>
                        <span className="text-gray-900">{userCompany.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Website:</span>
                        <span className="text-gray-900">{userCompany.website || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Industry:</span>
                        <span className="text-gray-900">{userCompany.industry}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Location:</span>
                        <span className="text-gray-900">{userCompany.location}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Employees:</span>
                        <span className="text-gray-900">{userCompany.number_of_employees || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-2">Company ID:</div>
                    <div className="font-mono text-gray-900">{userCompany._id || userCompany.id}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Company not found</h3>
                  <p className="text-gray-600">Unable to load company information</p>
                </div>
              )}
            </>
          )}

          {/* Company Resumes Tab */}
          {activeTab === 'resumes' && (
            <>
              {resumesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : resumes.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes uploaded yet</h3>
                  <p className="text-gray-600">HR users will appear here once they start uploading resumes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Uploaded Resumes</h3>
                    <div className="grid gap-4">
                      {resumes.map((resume, index) => (
                        <div key={resume.id || index} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {resume.name || "Unknown Candidate"}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(resume.total_score)}`}>
                                  {resume.total_score || 0}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">File:</span> {resume.filename}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                <div>
                                  <span className="font-medium">HR:</span> {resume.hr_name || "Unknown"}
                                </div>
                                <div>
                                  <span className="font-medium">Uploaded:</span> {resume.uploaded_at ? new Date(resume.uploaded_at).toLocaleDateString() : "Unknown"}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${getScoreColor(resume.total_score)}`}>
                                {getScoreLabel(resume.total_score)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {resume.experience_count || 0} exp • {resume.projects_count || 0} proj • {resume.certifications_count || 0} cert
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Protected>
  );
}
