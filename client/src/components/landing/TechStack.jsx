const TechStack = () => {
  const technologies = [
    {
      name: 'MySQL',
      icon: 'fa-database',
      color: 'blue',
      description:
        'Primary choice. ACID transactions and foreign-key enforcement guarantee data integrity for workflow-driven operations.',
    },
    {
      name: 'Node.js + Express.js',
      icon: 'fa-server',
      color: 'green',
      description:
        'Lightweight REST API layer with native JSON handling, JWT-based role authentication, and file-upload middleware (Multer).',
    },
    {
      name: 'React.js',
      icon: 'fa-code',
      color: 'cyan',
      description:
        'Role-specific dashboards (Student/Professor/Admin) with conditional routing and multi-part file uploads for assignments.',
    },
    {
      name: 'JWT + bcrypt',
      icon: 'fa-lock',
      color: 'purple',
      description:
        'Stateless token-based sessions matching the REST architecture. bcrypt for password hashing to satisfy basic security requirements.',
    },
  ];

  return (
    <section id="tech" className="py-24 bg-slate-900 text-white relative overflow-hidden fade-in-section">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Built with Modern Technology</h2>
          <p className="text-xl text-slate-400">Robust, scalable, and secure architecture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {technologies.map((tech, index) => (
            <div key={index} className="glass-card rounded-2xl p-8 card-hover flex gap-6 items-start">
              <div className={`w-16 h-16 rounded-xl bg-${tech.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                <i className={`fas ${tech.icon} text-3xl text-${tech.color}-400`}></i>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
                <p className="text-slate-300 leading-relaxed text-sm">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
