"use client";
import { useState } from "react";
import Protected from "@/components/Protected";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function SearchBySkills() {
  const { user } = useAuth();
  console.log(user);
  const [skills, setSkills] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const submit = async () => {
    if (!user?.company_id || !user?.id) {
      setErr("Authentication required. Please login again.");
      return;
    }

    if (!skills.trim()) {
      setErr("Please enter some skills to search for");
      return;
    }
    
    setErr("");
    setLoading(true);
    setResults([]);
    setSearchPerformed(false);
    
    try {
      const payload = { 
        company_id: user.company_id, 
        hr_id: user.hr_id, 
        skills: skills.split(",").map(s => s.trim()).filter(Boolean) 
      };
      
      const data = await api.searchBySkills(payload);
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

  // Static skill suggestions for quick selection
  const skillSuggestions = [
    "JavaScript", "TypeScript", "React", "Vue", "Angular",
    "Node.js", "Python", "Django", "Flask", "Java",
    "Spring Boot", "SQL", "MongoDB", "AWS", "Docker",
    "Kubernetes", "CI/CD", "Agile", "Scrum", "REST API"
  ];

  const addSuggestionToInput = (skill) => {
    const currentSkills = skills.trim();
    if (currentSkills === "") {
      setSkills(skill);
    } else {
      setSkills(`${currentSkills}, ${skill}`);
    }
  };

  return (
    <Protected role="hr">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 ">
        <div className="max-w-6xl mx-auto">
          {/* Header with company branding */}
          <div className="flex items-center justify-between mb-8 pt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TalentMatch Pro</h1>
              <p className="text-gray-600">Advanced Candidate Search Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600">HR Recruiter</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Searches</p>
                <p className="text-xl font-bold text-gray-900">142</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-4 flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Successful Hires</p>
                <p className="text-xl font-bold text-gray-900">38</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-4 flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Candidates</p>
                <p className="text-xl font-bold text-gray-900">1,243</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-4 flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Match Rate</p>
                <p className="text-xl font-bold text-gray-900">72%</p>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Advanced Skill-Based Search</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter skills separated by commas (e.g., Python, React, AWS)"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Separate multiple skills with commas for better matching
                </p>
              </div>
              
              {/* Skill Suggestions */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Select Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => addSuggestionToInput(skill)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={submit}
                  disabled={loading || !skills.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Resumes...
                    </div>
                  ) : (
                    "Search Candidates"
                  )}
                </button>
                
                <button className="px-4 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl text-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {err && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
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
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    {results.length} candidate{results.length !== 1 ? 's' : ''} found
                  </span>
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Export Results
                  </button>
                </div>
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
                    <div key={candidate.id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] border border-gray-100">
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

                        {/* Skills */}
                        {candidate.top_skills && candidate.top_skills.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {candidate.top_skills.slice(0, 5).map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-900">{candidate.experience_count || 0}</div>
                            <div className="text-xs text-gray-500">Experience</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-900">{candidate.projects_count || 0}</div>
                            <div className="text-xs text-gray-500">Projects</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
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
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${candidate.total_score}%` }}
                              ></div>
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
                        
                        {/* Action Buttons */}
                        <div className="mt-4 flex space-x-2">
                        <Link 
                        href={`/search/skills/${candidate.id}`} 
                        className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View More
                      </Link>
                          <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} TalentMatch Pro. All rights reserved.</p>
            <p className="mt-1">Advanced AI-powered recruitment platform</p>
          </div>
        </div>
      </div>
    </Protected>
  );
}