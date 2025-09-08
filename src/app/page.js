// app/page.jsx (updated home page)
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced resume parsing with machine learning algorithms that extract key information with 99% accuracy",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      )
    },
    {
      title: "ATS Scoring",
      description: "Applicant Tracking System compatibility scoring to optimize resumes for automated screening",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      )
    },
    {
      title: "Smart Search",
      description: "Find candidates by skills or job description matching with semantic search technology",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      )
    },
    {
      title: "Multi-Company Support",
      description: "Manage recruitment for multiple organizations from a single dashboard",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      )
    },
    {
      title: "Real-time Analytics",
      description: "Gain insights into your recruitment pipeline with detailed analytics and reporting",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      )
    },
    {
      title: "Secure & Compliant",
      description: "Enterprise-grade security with GDPR, CCPA, and SOC 2 compliance",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      )
    }
  ];

  const stats = [
    { value: "10K+", label: "Resumes Processed" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "2.5x", label: "Faster Hiring" },
    { value: "500+", label: "Companies Served" }
  ];

  const testimonials = [
    {
      quote: "This platform cut our screening time by 70% and helped us find better qualified candidates.",
      author: "Sarah Johnson",
      role: "HR Director, TechCorp Inc.",
      avatar: "SJ"
    },
    {
      quote: "The ATS scoring feature alone was worth the investment. Our application completion rates improved dramatically.",
      author: "Michael Chen",
      role: "Talent Acquisition Lead, StartupXYZ",
      avatar: "MC"
    },
    {
      quote: "Finally, a recruitment tool that actually understands what skills we're looking for.",
      author: "Lisa Rodriguez",
      role: "CTO, InnovateLabs",
      avatar: "LR"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      

      {/* Hero Section */}
      <section className="py-16 px-4 ">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              HR Resume Analysis System
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Streamline your recruitment process with our advanced resume analysis platform. 
            Powered by AI for multi-company resume analysis, 
            ATS scoring, and intelligent search capabilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/hr/login" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-700 hover:to-indigo-800"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Role
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* HR Users */}
            {/* <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">HR Users</h3>
              <p className="text-gray-600 mb-4">
                Upload resumes, analyze candidates, and search for the perfect match
              </p>
              <div className="space-y-2">
                <Link 
                  href="/hr/login" 
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  HR Login
                </Link>
                <Link 
                  href="/hr/register" 
                  className="block w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  HR Register
                </Link>
              </div>
            </div>

            {/* Company Admins */}
            {/* <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Company Admins</h3>
              <p className="text-gray-600 mb-4">
                Manage your company, HR users, and oversee recruitment processes
              </p>
              <Link 
                href="/company-admin/login" 
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Company Admin Login
              </Link>
            </div>

            {/* Super Admins */}
            {/* <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Super Admins</h3>
              <p className="text-gray-600 mb-4">
                System-wide administration, company management, and global oversight
              </p>
              <Link 
                href="/super-admin/login" 
                className="block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Super Admin Login
              </Link>
            </div>
          </div>
        </div> */}


      {/* Logo Cloud Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm mb-8">TRUSTED BY INDUSTRY LEADERS</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
            {["TechCorp", "InnovateLabs", "StartupXYZ", "GlobalSoft", "DataSystems"].map((company, index) => (
              <div key={index} className="flex justify-center">
                <div className="h-12 w-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-medium">
                  {company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your recruitment process and find the best talent
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Hear from TA professionals who transformed their hiring process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">&quot;{testimonial.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of companies that use our AI-powered resume analysis system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/hr/register" 
              className="inline-block px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/demo" 
              className="inline-block px-8 py-3 bg-transparent text-white font-bold rounded-lg border-2 border-white hover:bg-white hover:text-blue-700 transition-colors"
            >
              Request a Demo
            </Link>
          </div>
          <p className="text-sm opacity-80 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ResumeAI</h3>
              <p className="text-gray-600">AI-powered recruitment platform that helps you find the best talent faster.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Security</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}