"use client";
import { useState } from "react";
import Protected from "@/components/Protected";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function GlobalSearch() {
  const { user } = useAuth();
  const [searchType, setSearchType] = useState("skills");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const submit = async () => {
    if (!user?.company_id) {
      setErr("Authentication required. Please login again.");
      return;
    }

    if (!searchQuery.trim()) {
      setErr("Please enter a search query");
      return;
    }
    
    setErr("");
    setLoading(true);
    setResults([]);
    setSearchPerformed(false);
    
    try {
      const payload = { 
        search_type: searchType,
        search_query: searchQuery,
        company_id: user.company_id
      };
      
      const data = await api.globalSearch(payload);
      setResults(data.results || []);
      setSearchPerformed(true);
    } catch (e) {
      setErr(e.message || "An error occurred during search");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit();
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
    <Protected role="hr">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Global Resume Search
            </h1>
            <p className="text-lg text-gray-600">
              Search across all resumes in your company using job descriptions or specific skills
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="space-y-6">
              {/* Search Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="searchType"
                      value="skills"
                      checked={searchType === "skills"}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Search by Skills</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="searchType"
                      value="jd"
                      checked={searchType === "jd"}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Search by Job Description</span>
                  </label>
                </div>
              </div>

              {/* Search Query Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {searchType === "skills" ? "Required Skills" : "Job Description"}
                </label>
                <div className="relative">
                  {searchType === "skills" ? (
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter skills separated by commas (e.g., Python, React, AWS)"
                    />
                  ) : (
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg min-h-[120px] resize-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Paste or type the job description here..."
                    />
                  )}
                  <div className="absolute right-3 top-3 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {searchType === "skills" 
                    ? "Separate multiple skills with commas for better matching"
                    : "The system will extract skills from your job description and find matching candidates"
                  }
                </p>
              </div>
              
              <button
                onClick={submit}
                disabled={loading || !searchQuery.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                ) : (
                  `Search by ${searchType === "skills" ? "Skills" : "Job Description"}`
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
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results
                </h2>
                <span className="text-gray-600">
                  Found {results.length} matching candidate{results.length !== 1 ? 's' : ''}
                </span>
              </div>

              {results.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.5 0-4.847-.655-6.879-1.803M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or adding more skills</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((candidate, index) => (
                    <div key={candidate.id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
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
                            {getScoreLabel(candidate.match_score)} Match
                          </span>
                        </div>

                        {/* Match Reason */}
                        {candidate.reason && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">{candidate.reason}</p>
                          </div>
                        )}

                        {/* Skills Comparison for JD Search */}
                        {searchType === "jd" && candidate.jd_skills && candidate.candidate_skills && (
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

                        {/* Top Skills for Skills Search */}
                        {searchType === "skills" && candidate.top_skills && candidate.top_skills.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Matching Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {candidate.top_skills.slice(0, 5).map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-lg font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
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
