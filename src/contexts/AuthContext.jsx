"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function useAuth() {

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    const role = getCookie("role");
    const company_id = getCookie("company_id");
    const id = getCookie("id");
    const hr_id = getCookie("hr_id");
    console.log("hr_id",hr_id);
    console.log("id",id);
    console.log("data.role",role);
    if (token && role) {
      setUser({
        token,
        role,
        company_id: company_id || null,
        id: id || null,
        hr_id: hr_id || null,
      });
    }
  
    setLoading(false);
  }, []);
  

  const login = (data) => {
    const userData = {
      
      token: data.token,
      role: data.role,
      company_id: data.user?.company_id,
      id: data.user?.id,
      hr_id: data.role === "hr" ? data.user?.id : null,
      ...data.user
    };
console.log("userData",userData);
console.log("data.role",data.role);
    // Set cookies
    setCookie("token", data.token, 1);
    setCookie("role", data.role, 1);
    
    if (data.user?.company_id) {
      setCookie("company_id", data.user.company_id, 1);
    }
    console.log("data.role",data.role);
    
    if (data.role === "hr" || data.role === "company_admin") {
      setCookie("id", data.user.id, 1);
    }

    setUser(userData);
    console.log("User logged in:", userData);
  };

  const logout = () => {
    // Clear cookies
    deleteCookie("token");
    deleteCookie("role");
    deleteCookie("company_id");
    deleteCookie("id");
    deleteCookie("hr_id");
    setUser(null);
   
  };

  // Role checking functions
  const isAuthenticated = !!user;
  const isSuperAdmin = user?.role === "super_admin";
  const isCompanyAdmin = user?.role === "company_admin";
  const isHR = user?.role === "hr";
  const isAdmin = isSuperAdmin || isCompanyAdmin; // Both types of admins

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    isSuperAdmin,
    isCompanyAdmin,
    isHR,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
