// app/(dash)/admin/page.jsx (updated admin dashboard)
"use client";
import Protected from "@/components/Protected";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard(){
  const { user, isSuperAdmin, isCompanyAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect users to their appropriate dashboards
    if (isSuperAdmin) {
      router.push("/super-admin");
    } else if (isCompanyAdmin) {
      router.push("/company-admin");
    }
  }, [isSuperAdmin, isCompanyAdmin, router]);

  // Show loading while redirecting
  return (
    <Protected requiredRole={isSuperAdmin ? "super_admin" : "company_admin"}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    </Protected>
  );
}