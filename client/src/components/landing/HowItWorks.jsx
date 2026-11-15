const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: 'fa-user-plus',
      title: 'Register & Login',
      description: 'Create your account and verify your role',
    },
    {
      number: 2,
      icon: 'fa-book-open',
      title: 'Enroll in Courses',
      description: 'Browse batches and request enrollment',
    },
    {
      number: 3,
      icon: 'fa-laptop-code',
      title: 'Learn & Submit',
      description: 'Access materials, attend sessions, submit work',
    },
    {
      number: 4,
      icon: 'fa-chart-pie',
      title: 'Track & Analyze',
      description: 'Monitor grades, attendance, and placements',
    },
  ];

  return (
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
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-500 transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {step.number}
                  </div>
                  <i className={`fas ${step.icon} text-3xl text-slate-400 group-hover:text-blue-600 transition-colors`}></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
