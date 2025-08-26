// components/Navbar.jsx (updated)
"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout, isAuthenticated, isSuperAdmin, isCompanyAdmin, isHR } = useAuth();
  const pathname = usePathname();
  
  // Hide navbar on auth pages
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');
  if (isAuthPage) return null;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">HR Resume System</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/hr/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  HR Login
                </Link>
                <Link
                  href="/hr/register"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  HR Register
                </Link>
                <Link
                  href="/company-admin/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Company Admin Login
                </Link>
                <Link
                  href="/super-admin/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Super Admin Login
                </Link>
              </>
            ) : (
              <>
                {isHR && (
                  <>
                    <Link
                      href="/hr"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/analysis/upload"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Upload Resumes
                    </Link>
                    <Link
                      href="/search/skills"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Search by Skills
                    </Link>
                    <Link
                      href="/search/jd"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Search by JD
                    </Link>
                    <Link
                      href="/search/global"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Global Search
                    </Link>
                    <Link
                      href="/hr/resumes"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      My Resumes
                    </Link>
                  </>
                )}
                
                {(isSuperAdmin || isCompanyAdmin) && (
                  <>
                    <Link
                      href="/admin"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {isSuperAdmin ? "Super Admin Dashboard" : "Company Admin Dashboard"}
                    </Link>
                    {isSuperAdmin && (
                      <Link
                        href="/companies/create"
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Create Company
                      </Link>
                    )}
                  </>
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user?.role === 'hr' ? 'HR' : user?.role === 'super_admin' ? 'Super Admin' : 'Company Admin'}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}