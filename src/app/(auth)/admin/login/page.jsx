// app/(auth)/admin/login/page.jsx (updated admin login)
"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLogin(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); 
    setLoading(true);
    
    try {
      const data = await api.login({ email, password, role: "super_admin" });
      if (data?.token) {
        login(data);
        router.push("/super-admin/login");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (e) { 
      setErr(e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the administration dashboard</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              id="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="admin@example.com" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input 
              id="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="••••••••" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          
          {err && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {err}
            </div>
          )}
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            New admin? Use API to register or ask super-admin to create your account.
          </p>
        </div>
      </div>
    </div>
  );
}