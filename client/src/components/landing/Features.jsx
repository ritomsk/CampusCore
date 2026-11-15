const Features = () => {
  const features = [
    {
      icon: 'fa-shield-halved',
      color: 'blue',
      title: 'Role-Based Access Control',
      description:
        'Secure routing for Students, Professors, and Admins based on distinct identity privileges managed in the database at login.',
    },
    {
      icon: 'fa-layer-group',
      color: 'indigo',
      title: 'Batch Instance Creation',
      description:
        'Faculty can dynamically instantiate specific academic-year/semester classrooms linked to a generic static course catalog.',
    },
    {
      icon: 'fa-clipboard-check',
      color: 'emerald',
      title: 'Instructor Approval Workflow',
      description:
        'Database-driven state machine that moves student enrollment requests from Pending to Approved before granting resource access.',
    },
    {
      icon: 'fa-clock',
      color: 'amber',
      title: 'Time-Series Attendance',
      description:
        'Instructors generate daily lecture sessions and submit bulk attendance logs for approved batch students.',
    },
    {
      icon: 'fa-file-arrow-up',
      color: 'rose',
      title: 'Assignment Management',
      description:
        'Two-way submission system where instructors upload prompts and students submit solution files tracked with timestamps.',
    },
    {
      icon: 'fa-book-bookmark',
      color: 'cyan',
      title: 'Gated Academic Repository',
      description:
        'Version-aware distribution of syllabus, PYQs, and notes restricted to enrolled cohort members only.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Powerful Features</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Everything you need for academic excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className={`w-14 h-14 rounded-full bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                <i className={`fas ${feature.icon} text-2xl text-${feature.color}-600`}></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}

          {/* Placement Analytics - Centered */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover md:col-span-2 lg:col-span-3 lg:w-1/3 mx-auto">
            <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center mb-6">
              <i className="fas fa-chart-line text-2xl text-violet-600"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Placement Analytics</h3>
            <p className="text-slate-600 leading-relaxed">
              Real-time aggregation of department-wise recruitment metrics including packages, placement percentages, and
              recruiting companies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
