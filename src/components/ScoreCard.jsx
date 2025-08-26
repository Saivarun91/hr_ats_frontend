"use client";

export default function ScoreCard({ result }) {
    const items = [
      ["Resume Format & Length", "format_length"],
      ["Spelling & Grammar", "spelling_grammar"],
      ["Summary or Objective", "summary_objective"],
      ["Skills: Hard & Soft", "skills"],
      ["Work Experience", "work_experience"],
      ["Projects", "projects"],
      ["Certifications", "certifications"],
      ["Education", "education"],
      ["Contact Details", "contact_details"],
    ];
  
    const full = result.full_data || {};
  
    const getScoreColor = (score) => {
      if (score >= 80) return "text-green-600 bg-green-100";
      if (score >= 60) return "text-blue-600 bg-blue-100";
      if (score >= 40) return "text-yellow-600 bg-yellow-100";
      return "text-red-600 bg-red-100";
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xl font-semibold text-gray-900 mb-1">{result?.candidate_name || "Candidate"}</div>
            <div className="text-sm text-gray-500">{result?.email} · {result?.phone}</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{result?.total_score ?? "-"}/100</div>
        </div>
  
        {/* Score Breakdown */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {items.map(([label, key]) => (
            <div key={key} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <div className="text-lg font-semibold text-gray-900">{result?.breakdown?.[key] ?? "-"}</div>
            </div>
          ))}
        </div>
  
        {/* Expanded Details */}
        <div className="space-y-4">
          {full.summary && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Summary</p>
              <p className="text-sm text-gray-600">{full.summary}</p>
            </div>
          )}
          
          {full.education && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Education</p>
              <p className="text-sm text-gray-600">{full.education}</p>
            </div>
          )}
  
          {full.skills?.["Hard Skills"]?.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-800 mb-2">Hard Skills</p>
              <div className="flex flex-wrap gap-2">
                {full.skills["Hard Skills"].map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
  
          {full.skills?.["Soft Skills"]?.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm font-medium text-green-800 mb-2">Soft Skills</p>
              <div className="flex flex-wrap gap-2">
                {full.skills["Soft Skills"].map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
  
          {full.experience?.length > 0 && (
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm font-medium text-purple-800 mb-2">Experience</p>
              <div className="space-y-2">
                {full.experience.map((exp, i) => (
                  <div key={i} className="text-sm text-purple-700">
                    <span className="font-medium">{exp.Title}</span> @ <span className="font-medium">{exp.Company}</span>
                    <span className="text-purple-600 ml-2">({exp.Duration})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {full.projects?.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4">
              <p className="text-sm font-medium text-orange-800 mb-2">Projects</p>
              <div className="space-y-2">
                {full.projects.map((p, i) => (
                  <div key={i} className="text-sm text-orange-700">
                    <span className="font-medium">{p.Title}</span>: {p.Description}
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {full.certifications?.length > 0 && (
            <div className="bg-indigo-50 rounded-xl p-4">
              <p className="text-sm font-medium text-indigo-800 mb-2">Certifications</p>
              <div className="space-y-1">
                {full.certifications.map((c, i) => (
                  <div key={i} className="text-sm text-indigo-700">• {c}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  