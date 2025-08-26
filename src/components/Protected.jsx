"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Protected({ children, requiredRole }) {
  const {
    user,
    isAuthenticated,
    isSuperAdmin,
    isCompanyAdmin,
    isHR,
    loading
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to appropriate login based on required role
      if (requiredRole === "super_admin") {
        router.push("/super-admin/login");
      } else if (requiredRole === "company_admin") {
        router.push("/company-admin/login");
      } else if (requiredRole === "hr") {
        router.push("/hr/login");
      } else {
        router.push("/super-admin/login"); // Default to super admin login if requiredRole is not specified
      }
    }
  }, [loading, isAuthenticated, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return null;
  }

  // Role-based access control
  if (requiredRole === "super_admin" && !isSuperAdmin) {
    router.push("/super-admin/login");
    return null;
  }
  if (requiredRole === "company_admin" && !isCompanyAdmin) {
    router.push("/company-admin/login");
    return null;
  }
  if (requiredRole === "hr" && !isHR) {
    router.push("/hr/login");
    return null;
  }

  // Allow access if user has the required role
  return children;
}
