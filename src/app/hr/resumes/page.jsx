"use client";
import { useState, useEffect } from "react";
import Protected from "@/components/Protected";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";

export default function HRResumes() {
  const { user } = useAuth();
  console.log(user);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user?.company_id) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await api.getHRResumes(user.company_id);
      console.log(data.resumes);
      setResumes(data.resumes || []);
    } catch (e) {
      setErr(e.message || "Failed to fetch resumes");
    } finally {
      setLoading(false);
    }
  };
  const getTotalExperienceYears = (experience = []) => {
  let totalMonths = 0;

  experience.forEach(exp => {
    if (!exp.start_date) return;

    const startDate = new Date(exp.start_date);
    const endDate = exp.end_date
      ? new Date(exp.end_date)
      : new Date(); // handle ongoing job

    if (!isNaN(startDate) && !isNaN(endDate) && endDate > startDate) {
      const months =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      totalMonths += months;
    }
  });

  return (totalMonths / 12).toFixed(1); // e.g., 3.5 years
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 ">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Uploaded Resumes
            </h1>
            <p className="text-lg text-gray-600">
              View and manage all resumes you've uploaded for analysis
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Resumes</p>
                  <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">High Scores (80+)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {resumes.filter(r => r.total_score >= 80).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {resumes.length > 0 
                      ? Math.round(resumes.reduce((acc, r) => acc + (r.total_score || 0), 0) / resumes.length)
                      : 0
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(resumes.map(r => r.name)).size}
                  </p>
                </div>
              </div>
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

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes uploaded yet</h3>
              <p className="text-gray-600">Start by uploading some resumes for analysis</p>
              <Link 
                href="/analysis/upload" 
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Resumes
              </Link>
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
                    {/* View More */}
                    <div className="mt-4 text-right">
                      <Link 
                        href={`/hr/resumes/${resume.id}`} 
                        className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Protected>
  );
}
