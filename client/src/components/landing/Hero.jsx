import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen hero-gradient flex items-center pt-20 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 animate-fade-in">
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
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto backdrop-blur-sm"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
