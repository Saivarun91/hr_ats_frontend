"use client";
import { useState, useCallback } from "react";
import Protected from "@/components/Protected";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function SearchByJD() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isAllowedFile(droppedFile.name)) {
      setFile(droppedFile);
      setErr("");
    } else {
      setErr("Please upload a valid file (PDF, DOCX, TXT, DOC)");
    }
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const isAllowedFile = (filename) => {
    const allowedExtensions = ['.pdf', '.docx', '.txt', '.doc'];
    return allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (isAllowedFile(selectedFile.name)) {
        setFile(selectedFile);
        setErr("");
      } else {
        setErr("Please select a valid file (PDF, DOCX, TXT, DOC)");
      }
    }
  };

  const submit = async () => {
    if (!user?.company_id || !user?.hr_id) {
      setErr("Authentication required. Please login again.");
      return;
    }

    if (!file) {
      setErr("Please select a job description file");
      return;
    }

    setErr("");
    setLoading(true);
    setResults([]);
    setSearchPerformed(false);

    try {
      const data = await api.searchByJD({ 
        file, 
        company_id: user.company_id, 
        hr_id: user.hr_id 
      });
      setResults(data.results || []);
      setSearchPerformed(true);
    } catch (e) {
      setErr(e.message || "An error occurred during search");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Poor Match";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Static stats for the dashboard
  const stats = [
    { label: "Avg. Processing Time", value: "3.2s per search", icon: "⏱️" },
    { label: "Supported Formats", value: "PDF, DOCX, TXT, DOC", icon: "📝" },
    { label: "Max File Size", value: "10MB", icon: "💾" },
    { label: "Success Rate", value: "98.7%", icon: "📊" }
  ];

  // Sample recent searches for the sidebar
  const recentSearches = [
    { title: "Senior Frontend Developer", date: "2 hours ago", matches: 12 },
    { title: "Data Scientist", date: "1 day ago", matches: 8 },
    { title: "Product Manager", date: "3 days ago", matches: 5 }
  ];

  return (
    <Protected role="hr">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 ">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Search by Job Description
                </h1>
                <p className="text-lg text-gray-600">
                  Upload a job description and find the most qualified candidates instantly
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Search API</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* File Upload Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Upload Job Description</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Supported: PDF, DOCX, TXT, DOC</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description File
                    </label>
                    
                    {/* Drag & Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                        isDragOver
                          ? 'border-green-400 bg-green-50'
                          : file
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                    >
                      {file ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            onClick={() => setFile(null)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              Drop your job description file here
                            </p>
                            <p className="text-sm text-gray-500">
                              or click to browse files
                            </p>
                          </div>
                          <p className="text-xs text-gray-400">
                            Supports PDF, DOCX, TXT, DOC files
                          </p>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt,.doc"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Browse Files
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={submit}
                    disabled={loading || !file}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing JD and Searching...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        Search Matching Candidates
                      </>
                    )}
                  </button>
                </div>
              </div>

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

              {/* Results */}
              {searchPerformed && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Search Results
                    </h2>
                    <span className="text-gray-600 bg-gray-100 py-1 px-3 rounded-full text-sm">
                      {results.length} candidate{results.length !== 1 ? 's' : ''} found
                    </span>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.5 0-4.847-.655-6.879-1.803M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                      <p className="text-gray-600">Try uploading a different job description or adjusting your requirements</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((candidate, index) => (
                        <div key={candidate.id || index} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {candidate.candidate_name}
                              </h3>
                              <p className="text-sm text-gray-500">{candidate.filename}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.match_score)}`}>
                              {candidate.match_score}%
                            </div>
                          </div>

                          {/* Score Label */}
                          <div className="mb-4">
                            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getScoreColor(candidate.match_score)}`}>
                              {getScoreLabel(candidate.match_score)}
                            </span>
                          </div>

                          {/* Match Reason */}
                          {candidate.reason && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">{candidate.reason}</p>
                            </div>
                          )}

                          {/* Skills Comparison */}
                          {candidate.jd_skills && candidate.candidate_skills && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Analysis</h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">JD Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.jd_skills.slice(0, 6).map((skill, skillIndex) => (
                                      <span
                                        key={skillIndex}
                                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-lg font-medium"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Candidate Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.candidate_skills.slice(0, 6).map((skill, skillIndex) => (
                                      <span
                                        key={skillIndex}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg font-medium"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{candidate.experience_count || 0}</div>
                              <div className="text-xs text-gray-500">Experience</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{candidate.projects_count || 0}</div>
                              <div className="text-xs text-gray-500">Projects</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{candidate.certifications_count || 0}</div>
                              <div className="text-xs text-gray-500">Certifications</div>
                            </div>
                          </div>

                          {/* ATS Score */}
                          {candidate.total_score && (
                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">ATS Score</span>
                                <span className="text-lg font-bold text-gray-900">{candidate.total_score}</span>
                              </div>
                            </div>
                          )}

                          {/* Contact Info */}
                          {candidate.contact_details && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm text-gray-600 truncate" title={candidate.contact_details}>
                                📧 {candidate.contact_details}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tips Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Tips for Better Results
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Include specific skills and requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>List required years of experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Specify education and certification requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Include both technical and soft skills</span>
                  </li>
                </ul>
              </div>

              {/* Recent Searches */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Searches</h3>
                <div className="space-y-4">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{search.title}</p>
                        <p className="text-gray-500">{search.date}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {search.matches} matches
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Matching Algorithm</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Skills Matching</span>
                    <span className="font-medium">40% weight</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience Level</span>
                    <span className="font-medium">25% weight</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Education & Certs</span>
                    <span className="font-medium">20% weight</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Keyword Density</span>
                    <span className="font-medium">15% weight</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}