"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

export default function Navbar() {
  const { user, logout, isAuthenticated, isHR } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  // Hide navbar on auth pages
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register");
  if (isAuthPage) return null;

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("role");
    deleteCookie("company_id");
    deleteCookie("id");
    
   
    router.push("/hr/login");
    // logout();
  };

  // ✅ Show navbar only if logged in as HR
  if (!isAuthenticated || !isHR) return null;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">TA System</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
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

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">TA</span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
