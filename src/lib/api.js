"use client";
import { getCookie } from "./cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/"; // adjust as needed

async function request(path, { method = "GET", body = null, isForm = false } = {}) {
  const headers = {};
  const token = getCookie("token");

  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : (body ? JSON.stringify(body) : null),
  });

  if (!res.ok) {
    const text = await res.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.error || errorData.message || `Request failed: ${res.status}`;
    } catch {
      errorMessage = text || `Request failed: ${res.status}`;
    }
    throw new Error(errorMessage);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

export const api = {
  // Auth
  register: (payload) => request("/users/register/", { method: "POST", body: payload }),
  registerHR: (payload) => request("/users/register-hr/", { method: "POST", body: payload }),
  login: (payload) => request("/users/login/", { method: "POST", body: payload }),

  // Company
  createCompany: (payload) => request("/company/create/", { method: "POST", body: payload }),
  listCompanies: () => request("/company/list/"),

  // Analysis
  analyze: ({ files, company_id}) => {
    const form = new FormData();
    for (const f of files) form.append("resumes", f);
    form.append("company_id", company_id);

    return request("/analysis/api/analysis/", { method: "POST", body: form, isForm: true });
  },

  // Search
  searchBySkills: async (payload) => {
    try {
      const response = await request("/search/by-skills/", { method: "POST", body: payload });
      return response;
    } catch (error) {
      console.error("Search by skills error:", error);
      throw error;
    }
  },
  
  searchByJD: async ({ file, company_id }) => {
    try {
      const form = new FormData();
      form.append("jd", file);
      form.append("company_id", company_id);
      const response = await request("/search/by-jd/", { method: "POST", body: form, isForm: true });
      return response;
    } catch (error) {
      console.error("Search by JD error:", error);
      throw error;
    }
  },

  // HR Resumes
  getHRResumes: (company_id) => {
    console.log("company_id", company_id);
    return request(`/analysis/hr-resumes/?company_id=${company_id}`);
  },

  // Get all resumes for admin view
  getAllResumes: () => request("/analysis/all-resumes/"),

  // Get resumes by company (for Company Admin)
  getCompanyResumes: (company_id) => request(`/analysis/hr-resumes/?company_id=${company_id}`),

  // Global search across all resumes
  globalSearch: (payload) => request("/search/global/", { method: "POST", body: payload }),

  // Add HR user (Super Admin and Company Admin only)
  addHR: (payload) => request("/users/add-hr/", { method: "POST", body: payload }),

  // Add Company Admin (Super Admin only)
  addCompanyAdmin: (payload) => request("/users/add-company-admin/", { method: "POST", body: payload }),
};
