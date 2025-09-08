// app/(dash)/hr/page.jsx (updated HR dashboard)
"use client";
import Protected from "@/components/Protected";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function HRDashboard(){
  const { user } = useAuth();
  
  const features = [
    {
      title: "Upload & Analyze",
      description: "Process multiple resumes for analysis",
      href: "/analysis/upload",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
      ),
      color: "blue"
    },
    {
      title: "Search by Skills",
      description: "Find candidates with specific skills",
      href: "/search/skills",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      ),
      color: "indigo"
    },
    {
      title: "Search by JD",
      description: "Match candidates to job descriptions",
      href: "/search/jd",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: "purple"
    },
    {
      title: "Global Search",
      description: "Search across all company resumes",
      href: "/search/global",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      ),
      color: "emerald"
    },
    {
      title: "My Resumes",
      description: "View all uploaded resumes",
      href: "/hr/resumes",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      color: "green"
    }
  ];

  // Static statistics data
  const stats = [
    { label: "Total Resumes", value: "1,248", change: "+12% this month" },
    { label: "Active Positions", value: "18", change: "+2 this month" },
    { label: "Candidates to Review", value: "47", change: "Urgent: 5" },
    { label: "Avg. Processing Time", value: "2.4 hrs", change: "-0.7hr from last week" }
  ];

  // Recent activity data
  const recentActivity = [
    { action: "Resume Upload", user: "Sarah Johnson", time: "10 mins ago", status: "Completed" },
    { action: "JD Analysis", user: "Michael Chen", time: "45 mins ago", status: "In Progress" },
    { action: "Resume Upload", user: "You", time: "1 hour ago", status: "Completed" },
    { action: "Candidate Search", user: "Lisa Rodriguez", time: "2 hours ago", status: "Completed" }
  ];

  // Upcoming events data
  const upcomingEvents = [
    { title: "Recruitment Meeting", time: "10:00 AM", date: "Tomorrow" },
    { title: "Candidate Interviews", time: "1:30 PM", date: "Oct 12" },
    { title: "HR Team Training", time: "9:00 AM", date: "Oct 15" }
  ];

  return (
    <Protected role="hr">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 ">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">TA Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || "TA Manager"}. Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white py-2 px-4 rounded-lg shadow-sm">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">System Status</p>
                  <p className="text-sm font-medium text-gray-900">All Systems Operational</p>
                </div>
              </div>
              <button className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className={`text-xs ${index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>{stat.change}</p>
              </div>
            ))}
          </div>
          
          {/* Main Features Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  href={feature.href}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group hover:border-blue-200"
                >
                  <div className={`w-12 h-12 bg-${feature.color}-50 rounded-lg flex items-center justify-center mb-4 text-${feature.color}-600 group-hover:bg-${feature.color}-100 transition-colors`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Lower Section with Recent Activity and Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="bg-blue-50 p-2 rounded-lg mr-4">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{activity.action}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${activity.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">By {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="text-sm text-gray-600 space-y-3">
                  <div className="flex justify-between">
                    <span>Company ID:</span>
                    <span className="font-mono text-gray-900">{user?.company_id || "CMP-12945"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TA ID:</span>
                    <span className="font-mono text-gray-900">{user?.id || "HR-4826"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="text-blue-600 font-medium">Enterprise</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <button className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors">
                      Manage Account
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Upcoming Events</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Calendar</button>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.time} • {event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}