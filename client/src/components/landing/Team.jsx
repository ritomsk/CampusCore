const Team = () => {
  const teamMembers = [
    { name: 'Ritom Saikia', roll: 'Insert Roll Number', initials: 'RS', color: 'blue' },
    { name: 'Insert Member 2 Name', roll: 'Insert Roll Number', initials: 'M2', color: 'emerald' },
    { name: 'Insert Member 3 Name', roll: 'Insert Roll Number', initials: 'M3', color: 'purple' },
  ];

  return (
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
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-md border border-slate-100 text-center card-hover">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-${member.color}-400 to-${member.color}-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4`}>
                {member.initials}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-slate-500 text-sm">Roll No: {member.roll}</p>
            </div>
          ))}
        </div>

        {/* Project Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-md border border-slate-100 px-8 py-6">
            <p className="text-slate-600 mb-2">
              <strong className="text-slate-900">Course:</strong> Database Application Development Laboratory
            </p>
            <p className="text-slate-600 mb-2">
              <strong className="text-slate-900">Assignment:</strong> CBDE-Based Project (Stage I, II, III)
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-900">Institution:</strong> Tezpur University, Department of CSE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
