const Stakeholders = () => {
  const stakeholders = [
    {
      title: 'Students',
      icon: 'fa-user-graduate',
      gradient: 'from-blue-500 to-blue-700',
      description:
        'Access batch-specific course materials, PYQs, and assignment submission portals, plus visibility into placement analytics that inform career decisions.',
    },
    {
      title: 'Professors',
      icon: 'fa-chalkboard-teacher',
      gradient: 'from-emerald-500 to-emerald-700',
      description:
        'Administrative control to create batch instances, approve or reject student enrollment requests, record daily attendance, and manage assignment grading workflows.',
    },
    {
      title: 'Administrators',
      icon: 'fa-building-columns',
      gradient: 'from-purple-500 to-purple-700',
      description:
        'Aggregated, cross-batch analytical views of placement records and academic performance metrics to support departmental reporting and decision-making.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-white fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Designed for Every Stakeholder</h2>
          <p className="text-xl text-slate-600">Tailored experiences for all users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stakeholders.map((stakeholder, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 card-hover bg-white flex flex-col">
              <div className={`h-32 bg-gradient-to-br ${stakeholder.gradient} flex items-center justify-center`}>
                <i className={`fas ${stakeholder.icon} text-5xl text-white opacity-80`}></i>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{stakeholder.title}</h3>
                <p className="text-slate-600 leading-relaxed">{stakeholder.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stakeholders;
