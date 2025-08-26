// app/companies/page.jsx (updated companies page)
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CompaniesPage(){
  const [companies, setCompanies] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    api.listCompanies()
      .then(data => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(e => {
        setErr(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <p className="text-gray-600">Browse all companies using our platform</p>
      </div>
      
      {err && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {err}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.companies?.map(c => (
            <div 
              key={c._id || c.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-lg">
                    {c.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {c.industry} · {c.location}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}