"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Protected from "@/components/Protected";
import { api } from "@/lib/api";

export default function ResumeDetail() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await api.getResumeById(id);
        setResume(data);
      } catch (err) {
        console.error("Error fetching resume:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!resume) {
    return <p className="text-center text-red-500">Resume not found.</p>;
  }

  // Calculate overall score percentage
  const overallScore = resume.total_score || 0;
  
  // Score indicator color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Score bar with visual indicator
  const ScoreBar = ({ score, label }) => (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            score >= 80 ? "bg-green-600" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <Protected role="hr">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden mt-6 mb-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {resume.name || "Unknown Candidate"}
              </h1>
              <p className="text-blue-100 mb-2">📧 {resume.contact_details}</p>
              <div className="flex items-center">
                <span className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm">
                  {resume.education || "Education not provided"}
                </span>
                <span className="ml-3 text-blue-200 text-sm">
                  Uploaded: {resume.uploaded_at ? new Date(resume.uploaded_at).toLocaleDateString() : "Unknown"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">Overall Score</div>
              <div className={`text-4xl font-extrabold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {["overview", "experience", "skills", "education"].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 font-medium text-sm ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <section className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {resume.summary || "No summary provided"}
                  </p>
                </section>

                {/* Key Qualifications */}
                <section className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
                    Key Qualifications
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Hard Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills_hard?.map((skill, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                            {skill}
                          </span>
                        )) || "N/A"}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Soft Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills_soft?.map((skill, i) => (
                          <span key={i} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                            {skill}
                          </span>
                        )) || "N/A"}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  At a Glance
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Experience</h3>
                    <p className="text-gray-600">
                      {resume.experience?.length || 0} position(s)
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Projects</h3>
                    <p className="text-gray-600">
                      {resume.projects?.length || 0} project(s)
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Certifications</h3>
                    <p className="text-gray-600">
                      {resume.certifications?.length || 0} certification(s)
                    </p>
                  </div>
                  
                  {/* <div>
                    <h3 className="font-medium text-gray-700 mb-2">Top Skills Match</h3>
                    <div className="mt-2 space-y-2">
                      <ScoreBar score={resume.skills_score || 0} label="Skills" />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === "experience" && resume.experience?.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">{exp.Title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {exp.Duration}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium mb-2">{exp.Company}</p>
                    <p className="text-gray-600">{exp.Description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Skills Assessment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills_hard?.map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                        {skill}
                      </span>
                    )) || "N/A"}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills_soft?.map((skill, i) => (
                      <span key={i} className="bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                        {skill}
                      </span>
                    )) || "N/A"}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Education & Certifications
              </h2>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Education</h3>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                  {resume.education || "Not provided"}
                </p>
              </div>
              
              {resume.certifications?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Certifications</h3>
                  <ul className="space-y-2">
                    {resume.certifications.map((cert, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Scores Tab */}
          {/* {activeTab === "scores" && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                ATS Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ScoreBar score={resume.total_score || 0} label="Total Score" />
                  <ScoreBar score={resume.format_score*10 || 0} label="Format" />
                  <ScoreBar score={resume.spelling_grammar*10 || 0} label="Grammar & Spelling" />
                  <ScoreBar score={resume.skills_score*10 || 0} label="Skills" />
                  <ScoreBar score={resume.experience_score*10 || 0} label="Experience" />
                  <ScoreBar score={resume.projects_score*10 || 0} label="Projects" />
                </div>
                <div>
                  <ScoreBar score={resume.certifications_score*10 || 0} label="Certifications" />
                  <ScoreBar score={resume.education_score*10 || 0} label="Education" />
                  <ScoreBar score={resume.contact_score*10 || 0} label="Contact Info" />
                  <ScoreBar score={resume.spelling_grammar*10 || 0} label="Grammar & Spelling" />
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Recommendations</h3>
                <ul className="list-disc list-inside text-blue-700">
                  {resume.skills_score < 70 && (
                    <li>Candidate may benefit from additional skill development in key areas</li>
                  )}
                  {resume.experience_score < 60 && (
                    <li>Experience level may not fully match requirements</li>
                  )}
                  {resume.spelling_grammar < 90 && (
                    <li>Review document for grammatical improvements</li>
                  )}
                  {overallScore >= 80 && (
                    <li>Strong candidate worth prioritizing for interview</li>
                  )}
                </ul>
              </div>
            </section>
          )} */}

          {/* Projects Section (shown in multiple tabs) */}
          {resume.projects?.length > 0 && activeTab !== "scores" && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Notable Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resume.projects.map((proj, i) => (
                  <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">{proj.Title}</h3>
                    <p className="text-gray-600 text-sm">{proj.Description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Protected>
  );
}