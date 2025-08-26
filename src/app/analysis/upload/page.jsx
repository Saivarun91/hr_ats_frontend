"use client";
import { useState, useEffect } from "react";
import Protected from "@/components/Protected";
import UploadBox from "@/components/UploadBox";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ScoreCard from "@/components/ScoreCard";
import Link from "next/link";

export default function UploadAnalyze() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [resumes, setResumes] = useState([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "myResumes"

  useEffect(() => {
    if (user?.company_id && user?.hr_id) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      setResumesLoading(true);
      const data = await api.getHRResumes(user.company_id, user.hr_id);
      
      setResumes(data.resumes || []);
    } catch (e) {
      console.error("Failed to fetch resumes:", e);
    } finally {
      setResumesLoading(false);
    }
  };

  const submit = async () => {
    if (!user?.company_id || !user?.hr_id) {
      setErr("Authentication required. Please login again.");
      return;
    }

    setErr("");
    setLoading(true);
    setResults([]);

    try {
      const data = await api.analyze({ 
        files, 
        company_id: user.company_id, 
        hr_id: user.hr_id 
      });
      
      // Now backend returns candidates with flat fields
      const candidates = Array.isArray(data?.candidates) ? data.candidates : [];
      const transformed = candidates.map(transformATSData);
      setResults(transformed);
      
      // Refresh the resumes list after successful upload
      fetchResumes();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function: maps flat backend data to frontend structure
  function transformATSData(d) {
    const contactText = d.contact_details || "";
    const emailMatch = contactText.match(/([\w.\-+]+@\w+\.\w+)/i);
    const phoneMatch = contactText.match(/(\+?\d[\d\s-]+)/);

    return {
      candidate_name: d.name || "Candidate",
      email: emailMatch ? emailMatch[1] : "",
      phone: phoneMatch ? phoneMatch[1].trim() : "",
      total_score: d.total_score || 0,
      breakdown: {
        format_length: d.format_score,
        spelling_grammar: d.spelling_grammar,
        summary_objective: d.summary_score,
        skills: d.skills_score,
        work_experience: d.experience_score,
        projects: d.projects_score,
        certifications: d.certifications_score,
        education: d.education_score,
        contact_details: d.contact_score,
      },
      full_data: {
        filename: d.filename,
        summary: d.summary || "",
        education: d.education || "",
        experience: d.experience || [],
        projects: d.projects || [],
        skills: {
          "Hard Skills": d.skills_hard || [],
          "Soft Skills": d.skills_soft || [],
        },
        certifications: d.certifications || []
      }
    };
  }

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

  // Static stats for the dashboard
  const stats = [
    { label: "Total Resumes", value: resumes.length, icon: "📄" },
    { label: "High Scores (80+)", value: resumes.filter(r => r.total_score >= 80).length, icon: "⭐" },
    { label: "Avg. Score", value: resumes.length > 0 ? Math.round(resumes.reduce((acc, r) => acc + (r.total_score || 0), 0) / resumes.length) : 0, icon: "📊" },
    { label: "Unique Candidates", value: new Set(resumes.map(r => r.name)).size, icon: "👤" }
  ];

  return (
    <Protected role="hr">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 ">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Resume Analysis Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  Upload, analyze, and manage candidate resumes
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Analysis API</p>
                    <p className="text-sm font-medium text-gray-900">Operational</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{stat.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-xl p-2 mb-6 flex">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all ${
                activeTab === "upload" 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Upload & Analyze
            </button>
            <button
              onClick={() => setActiveTab("myResumes")}
              className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all ${
                activeTab === "myResumes" 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              My Resumes ({resumes.length})
            </button>
          </div>

          {activeTab === "upload" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Upload Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Upload Resumes</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Supported: PDF, DOC, DOCX</span>
                    </div>
                  </div>
                  
                  <UploadBox onFiles={setFiles} />
                  
                  <div className="mt-6">
                    <button
                      onClick={submit}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl text-lg transition-all duration-200 flex items-center justify-center"
                      disabled={!files?.length || loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing... Please wait
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          Start Analysis
                        </>
                      )}
                    </button>
                  </div>

                  {err && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-800">{err}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results */}
                
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Tips Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    Tips for Best Results
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Use recent resumes with clear formatting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Ensure contact information is included</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Files should be in English for accurate analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>For best scoring, include skills sections</span>
                    </li>
                  </ul>
                </div>

                {/* Analysis Metrics */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Scoring Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Format & Structure</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Skills & Experience</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Education & Certs</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '20%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Contact Details</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{width: '10%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Grammar & Spelling</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Analyses</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">Marketing Manager</p>
                        <p className="text-gray-500">12 resumes</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">Software Engineer</p>
                        <p className="text-gray-500">8 resumes</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">Sales Representative</p>
                        <p className="text-gray-500">5 resumes</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* My Resumes Tab */
            <div>
              {/* Error Display */}
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

              {/* Loading State */}
              {resumesLoading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : resumes.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes uploaded yet</h3>
                  <p className="text-gray-600">Start by uploading some resumes for analysis</p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload Resumes
                  </button>
                </div>
              ) : (
                /* Resumes Grid */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resumes.map((resume, index) => (
                    <div key={resume.id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {resume.name || "Unknown Candidate"}
                            </h3>
                            <p className="text-sm text-gray-500">{resume.filename}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(resume.total_score)}`}>
                            {resume.total_score || 0}
                          </div>
                        </div>

                        {/* Score Label */}
                        <div className="mb-4">
                          <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getScoreColor(resume.total_score)}`}>
                            {getScoreLabel(resume.total_score)} Score
                          </span>
                        </div>

                        {/* Skills */}
                        {resume.skills_hard && resume.skills_hard.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Hard Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {resume.skills_hard.slice(0, 4).map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                              {resume.skills_hard.length > 4 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                                  +{resume.skills_hard.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{resume.experience?.length || 0}</div>
                            <div className="text-xs text-gray-500">Experience</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{resume.projects?.length || 0}</div>
                            <div className="text-xs text-gray-500">Projects</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{resume.certifications?.length || 0}</div>
                            <div className="text-xs text-gray-500">Certifications</div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        {resume.contact_details && (
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-600 truncate" title={resume.contact_details}>
                              📧 {resume.contact_details}
                            </p>
                          </div>
                        )}

                        {/* Upload Date */}
                        <div className="border-t pt-4 mt-4">
                          <p className="text-xs text-gray-500">
                            Uploaded: {resume.uploaded_at ? new Date(resume.uploaded_at).toLocaleDateString() : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Protected>
  );
}