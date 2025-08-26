"use client";
import Protected from "@/components/Protected";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog } from "@headlessui/react"; // install headlessui if not present

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('companies');
  const [showHRModal, setShowHRModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [hrForm, setHrForm] = useState({ name: "", email: "", password: "", company_code: "" });
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "", company_code: "" });
  
  useEffect(() => {
    fetchCompanies();
    fetchAllResumes();
  }, []);


  const handleAddHR = async () => {
    try {
      const response = await api.addHR({
        ...hrForm,
        company_code: parseInt(hrForm.company_code, 10),
      });
      alert(`HR created!\nName: ${response.hr.name}\nEmail: ${response.hr.email}`);
      setShowHRModal(false);
      window.location.reload();
    } catch (error) {
      alert(`Error creating HR: ${error.message}`);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const response = await api.addCompanyAdmin({
        ...adminForm,
        company_code: parseInt(adminForm.company_code, 10),
      });
      alert(`Admin created!\nName: ${response.company_admin.name}\nEmail: ${response.company_admin.email}`);
      setShowAdminModal(false);
      window.location.reload();
    } catch (error) {
      alert(`Error creating Admin: ${error.message}`);
    }
  };


  const fetchCompanies = async () => {
    try {
      const data = await api.listCompanies();
      setCompanies(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResumes = async () => {
    try {
      setResumesLoading(true);
      const data = await api.getAllResumes();
      setResumes(data.resumes || []);
    } catch (e) {
      console.error("Error fetching resumes:", e);
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

  return (
    <Protected requiredRole="super_admin">
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Super Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage all companies and system settings
              </p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/companies/create" 
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Create Company
              </Link>
              <div className="flex space-x-4">
            <button
              onClick={() => setShowHRModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg"
            >
              Add HR User
            </button>
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-lg"
            >
              Add Company Admin
            </button>
          </div>
            </div>
          </div>

          <Dialog open={showHRModal} onClose={() => setShowHRModal(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add HR User</h2>
                <div className="space-y-3">
                  <input placeholder="Name" className="w-full border p-2 rounded"
                    value={hrForm.name} onChange={(e) => setHrForm({ ...hrForm, name: e.target.value })} />
                  <input placeholder="Email" className="w-full border p-2 rounded"
                    value={hrForm.email} onChange={(e) => setHrForm({ ...hrForm, email: e.target.value })} />
                  <input type="password" placeholder="Password" className="w-full border p-2 rounded"
                    value={hrForm.password} onChange={(e) => setHrForm({ ...hrForm, password: e.target.value })} />
                  <input placeholder="Company Code" className="w-full border p-2 rounded"
                    value={hrForm.company_code} onChange={(e) => setHrForm({ ...hrForm, company_code: e.target.value })} />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button onClick={() => setShowHRModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                  <button onClick={handleAddHR} className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
                </div>
              </div>
            </div>
          </Dialog>

          {/* Admin Modal */}
          <Dialog open={showAdminModal} onClose={() => setShowAdminModal(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add Company Admin</h2>
                <div className="space-y-3">
                  <input placeholder="Name" className="w-full border p-2 rounded"
                    value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} />
                  <input placeholder="Email" className="w-full border p-2 rounded"
                    value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} />
                  <input type="password" placeholder="Password" className="w-full border p-2 rounded"
                    value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} />
                  <input placeholder="Company Code" className="w-full border p-2 rounded"
                    value={adminForm.company_code} onChange={(e) => setAdminForm({ ...adminForm, company_code: e.target.value })} />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button onClick={() => setShowAdminModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                  <button onClick={handleAddAdmin} className="px-4 py-2 bg-purple-600 text-white rounded">Create</button>
                </div>
              </div>
            </div>
          </Dialog>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white rounded-xl p-1 mb-8 shadow-sm">
            <button
              onClick={() => setActiveTab('companies')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'companies'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Companies ({companies.companies?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('resumes')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'resumes'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Resumes ({resumes.length})
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

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companies.companies?.map((c) => (
                    <div 
                      key={c._id || c.id} 
                      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <div className="flex items-start mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center mr-3">
                          <span className="text-red-600 font-bold text-lg">
                            {c.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{c.name}</h3>
                          <div className="text-xs text-gray-500 mt-1">
                            {c.industry} · {c.location}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{c.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Company Code:</span>
                          <span className="font-mono font-medium">{c.company_code}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-700 truncate">{c.email}</span>
                        </div>
                        {c.number_of_employees && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Employees:</span>
                            <span className="text-gray-700">{c.number_of_employees}</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          ID: {c._id || c.id}
                        </span>
                        <button 
                          onClick={() => {
                            // Show detailed modal or expand view
                            alert(`Company Details:\n\nName: ${c.name}\nIndustry: ${c.industry}\nLocation: ${c.location}\nDescription: ${c.description}\nCompany Code: ${c.company_code}\nEmail: ${c.email}\nEmployees: ${c.number_of_employees || 'N/A'}\nWebsite: ${c.website || 'N/A'}`);
                          }}
                          className="text-xs text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Resumes Tab */}
          {activeTab === 'resumes' && (
            <>
              {resumesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">All Uploaded Resumes</h3>
                    <div className="grid gap-4">
                      {resumes.map((resume, index) => (
                        <div key={resume.id || index} className="border border-gray-200 rounded-xl p-4 hover:border-red-300 transition-colors">
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
                              <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                                <div>
                                  <span className="font-medium">Company:</span> {resume.company_name || "Unknown"}
                                </div>
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
