import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 antialiased overflow-x-hidden min-h-screen">
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed w-full z-50 bg-slate-900/95 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-3">
              <i className="fas fa-graduation-cap text-3xl text-blue-500"></i>
              <Link to="/" className="text-2xl font-bold text-white tracking-tight">
                CampusCore
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">
                Features
              </a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors font-medium">
                About
              </a>
              <a href="#tech" className="text-slate-300 hover:text-white transition-colors font-medium">
                Tech Stack
              </a>
              <a href="#team" className="text-slate-300 hover:text-white transition-colors font-medium">
                Team
              </a>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30"
              >
                Login
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-blue-400 focus:outline-none p-2"
                aria-label="Toggle Menu"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                About
              </a>
              <a
                href="#tech"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                Tech Stack
              </a>
              <a
                href="#team"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                Team
              </a>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen hero-gradient flex items-center pt-20 overflow-hidden">
        {/* Decorative circles */}
        <div
          className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"
          style={{ animationDelay: '4s' }}
        ></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 39.5h40V40H0zm39.5 0V0h.5v40z' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E\")",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 animate-fade-in py-20">
          <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold tracking-wide uppercase mb-6 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            v2.0 Now Live
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Campus<span className="text-blue-300">Core</span>
          </h1>
          <h2 className="text-xl md:text-3xl text-blue-100 font-semibold mb-8 max-w-3xl">
            Relational Academic Workspace & Policy Engine
          </h2>
          <p className="text-lg md:text-xl text-blue-50/80 mb-10 max-w-4xl leading-relaxed font-light">
            A genuinely relational academic ERP that builds institutional rules directly into the database layer — enrollment
            approval workflows, time-stamped attendance, deadline-aware submissions — all modeled as explicit entities and
            constraints, not afterthoughts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto text-center"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto backdrop-blur-sm text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-50 fade-in-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Everything you need for academic excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <i className="fas fa-shield-halved text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Role-Based Access Control</h3>
              <p className="text-slate-600 leading-relaxed">
                Secure routing for Students, Professors, and Admins based on distinct identity privileges managed in the database at login.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <i className="fas fa-layer-group text-2xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Batch Instance Creation</h3>
              <p className="text-slate-600 leading-relaxed">
                Faculty can dynamically instantiate specific academic-year/semester classrooms linked to a generic static course catalog.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <i className="fas fa-clipboard-check text-2xl text-emerald-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instructor Approval Workflow</h3>
              <p className="text-slate-600 leading-relaxed">
                Database-driven state machine that moves student enrollment requests from Pending to Approved before granting resource access.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <i className="fas fa-clock text-2xl text-amber-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Time-Series Attendance</h3>
              <p className="text-slate-600 leading-relaxed">
                Instructors generate daily lecture sessions and submit bulk attendance logs for approved batch students.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-6">
                <i className="fas fa-file-arrow-up text-2xl text-rose-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Assignment Management</h3>
              <p className="text-slate-600 leading-relaxed">
                Two-way submission system where instructors upload prompts and students submit solution files tracked with timestamps.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center mb-6">
                <i className="fas fa-book-bookmark text-2xl text-cyan-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gated Academic Repository</h3>
              <p className="text-slate-600 leading-relaxed">
                Version-aware distribution of syllabus, PYQs, and notes restricted to enrolled cohort members only.
              </p>
            </div>

            {/* Feature 7 - Centered */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover md:col-span-2 lg:col-span-3 lg:w-1/3 mx-auto">
              <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-2xl text-violet-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Placement Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                Real-time aggregation of department-wise recruitment metrics including packages, placement percentages, and recruiting companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-white fade-in-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-xl text-slate-600">Seamless workflow from start to finish</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 border-t-2 border-dashed border-slate-300 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-500 transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    1
                  </div>
                  <i className="fas fa-user-plus text-3xl text-slate-400 group-hover:text-blue-600 transition-colors"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Register & Login</h3>
                <p className="text-slate-600 text-sm">Create your account and verify your role</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-500 transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    2
                  </div>
                  <i className="fas fa-book-open text-3xl text-slate-400 group-hover:text-blue-600 transition-colors"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Enroll in Courses</h3>
                <p className="text-slate-600 text-sm">Browse batches and request enrollment</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-500 transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    3
                  </div>
                  <i className="fas fa-laptop-code text-3xl text-slate-400 group-hover:text-blue-600 transition-colors"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Learn & Submit</h3>
                <p className="text-slate-600 text-sm">Access materials, attend sessions, submit work</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-500 transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    4
                  </div>
                  <i className="fas fa-chart-pie text-3xl text-slate-400 group-hover:text-blue-600 transition-colors"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Track & Analyze</h3>
                <p className="text-slate-600 text-sm">Monitor grades, attendance, and placements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TECH STACK */}
      <section id="tech" className="py-24 bg-slate-900 text-white relative overflow-hidden fade-in-section">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Built with Modern Technology</h2>
            <p className="text-xl text-slate-400">Robust, scalable, and secure architecture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MySQL */}
            <div className="glass-card rounded-2xl p-8 card-hover flex gap-6 items-start">
              <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-database text-3xl text-blue-400"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">MySQL</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Primary choice. ACID transactions and foreign-key enforcement guarantee data integrity for workflow-driven operations.
                </p>
              </div>
            </div>

            {/* Node.js + Express */}
            <div className="glass-card rounded-2xl p-8 card-hover flex gap-6 items-start">
              <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-server text-3xl text-green-400"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Node.js + Express.js</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Lightweight REST API layer with native JSON handling, JWT-based role authentication, and file-upload middleware (Multer).
                </p>
              </div>
            </div>

            {/* React.js */}
            <div className="glass-card rounded-2xl p-8 card-hover flex gap-6 items-start">
              <div className="w-16 h-16 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-code text-3xl text-cyan-400"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">React.js</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Role-specific dashboards (Student/Professor/Admin) with conditional routing and multi-part file uploads for assignments.
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="glass-card rounded-2xl p-8 card-hover flex gap-6 items-start">
              <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-lock text-3xl text-purple-400"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">JWT + bcrypt</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Stateless token-based sessions matching the REST architecture. bcrypt for password hashing to satisfy security requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DATABASE SCHEMA */}
      <section className="py-24 bg-slate-50 border-y border-slate-200 fade-in-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Comprehensive Database Design</h2>
            <p className="text-xl text-slate-600">12 interconnected tables ensuring absolute data integrity</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Users</h4>
              <p className="text-xs text-slate-500 font-mono">user_id, email, role</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Students</h4>
              <p className="text-xs text-slate-500 font-mono">roll_no, name, cgpa</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Professors</h4>
              <p className="text-xs text-slate-500 font-mono">prof_id, name, department</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Courses</h4>
              <p className="text-xs text-slate-500 font-mono">course_code, title, credits</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Batches</h4>
              <p className="text-xs text-slate-500 font-mono">batch_id, course, semester</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Enrollments</h4>
              <p className="text-xs text-slate-500 font-mono">enrollment_id, status</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-cyan-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Course_Materials</h4>
              <p className="text-xs text-slate-500 font-mono">material_id, type, uri</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Submissions</h4>
              <p className="text-xs text-slate-500 font-mono">submission_id, file, time</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Class_Sessions</h4>
              <p className="text-xs text-slate-500 font-mono">session_id, date, topic</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Attendance_Logs</h4>
              <p className="text-xs text-slate-500 font-mono">log_id, status, time</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-teal-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Grades</h4>
              <p className="text-xs text-slate-500 font-mono">grade_id, score, max</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-violet-500 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Placements</h4>
              <p className="text-xs text-slate-500 font-mono">placement_id, company</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STAKEHOLDERS */}
      <section id="about" className="py-24 bg-white fade-in-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Designed for Every Stakeholder</h2>
            <p className="text-xl text-slate-600">Tailored experiences for all users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Students */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 card-hover bg-white flex flex-col">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <i className="fas fa-user-graduate text-5xl text-white opacity-80"></i>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Students</h3>
                <p className="text-slate-600 leading-relaxed">
                  Access batch-specific course materials, PYQs, and assignment submission portals, plus visibility into placement analytics that inform career decisions.
                </p>
              </div>
            </div>

            {/* Professors */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 card-hover bg-white flex flex-col">
              <div className="h-32 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <i className="fas fa-chalkboard-teacher text-5xl text-white opacity-80"></i>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Professors</h3>
                <p className="text-slate-600 leading-relaxed">
                  Administrative control to create batch instances, approve or reject student enrollment requests, record daily attendance, and manage assignment grading workflows.
                </p>
              </div>
            </div>

            {/* Administrators */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 card-hover bg-white flex flex-col">
              <div className="h-32 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <i className="fas fa-building-columns text-5xl text-white opacity-80"></i>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Administrators</h3>
                <p className="text-slate-600 leading-relaxed">
                  Aggregated, cross-batch analytical views of placement records and academic performance metrics to support departmental reporting and decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TEAM SECTION */}
      <section id="team" className="py-24 bg-slate-50 fade-in-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Meet Our Team</h2>
            <p className="text-lg text-blue-600 font-semibold mb-2">
              Group No. 18 | Database Application Development Laboratory | CBDE Assignment
            </p>
            <p className="text-slate-600">Built by students, for the campus.</p>
          </div>

          {/* Instructor */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-amber-500 flex items-center gap-6 justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                SR
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Prof. Swarup Roy</h3>
                <p className="text-slate-500">Project Instructor</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Member 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-md mb-6">
                RS
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Ritom Saikia</h3>
              <p className="text-blue-600 font-medium text-sm">Roll No: CSB24002</p>
            </div>

            {/* Member 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-md mb-6">
                PD
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Partha Pratim Das</h3>
              <p className="text-blue-600 font-medium text-sm">Roll No: CSB24007</p>
            </div>

            {/* Member 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-md mb-6">
                DS
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Debankur Saikia</h3>
              <p className="text-blue-600 font-medium text-sm">Roll No: CSB24008</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-20 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <i className="fas fa-graduation-cap text-2xl text-blue-500"></i>
                <span className="text-xl font-bold text-white">CampusCore</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 text-slate-400">
                A genuinely relational academic ERP that builds institutional rules directly into the database layer for maximum
                integrity and efficiency.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#team" className="hover:text-white transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors text-blue-400 font-medium">
                    Login to Platform
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Resources</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a href="#tech" className="hover:text-white transition-colors">
                    Tech Stack
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features Overview
                  </a>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">Database Schema</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt mt-1 text-blue-500"></i>
                  <span>
                    Tezpur University
                    <br />
                    Napaam, Tezpur
                    <br />
                    Assam 784028, India
                  </span>
                </li>
                <li className="flex items-center gap-3 mt-4">
                  <i className="fas fa-envelope text-blue-500"></i>
                  <a href="mailto:admin@campuscore.edu" className="hover:text-white transition-colors">
                    admin@campuscore.edu
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>&copy; 2026 CampusCore. All rights reserved.</p>
            <p>Group 18 | CBDE Assignment</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
