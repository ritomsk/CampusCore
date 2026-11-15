const SchemaDisplay = () => {
  const tables = [
    { name: 'Users', pk: 'user_id, email, role', color: 'blue' },
    { name: 'Students', pk: 'roll_no, name, cgpa', color: 'blue' },
    { name: 'Professors', pk: 'prof_id, name, department', color: 'emerald' },
    { name: 'Courses', pk: 'course_code, title, credits', color: 'indigo' },
    { name: 'Batches', pk: 'batch_id, course, semester', color: 'indigo' },
    { name: 'Enrollments', pk: 'enrollment_id, status', color: 'emerald' },
    { name: 'Course_Materials', pk: 'material_id, type, url', color: 'cyan' },
    { name: 'Submissions', pk: 'submission_id, file, time', color: 'rose' },
    { name: 'Class_Sessions', pk: 'session_id, date, topic', color: 'amber' },
    { name: 'Attendance_Logs', pk: 'log_id, status, time', color: 'amber' },
    { name: 'Grades', pk: 'grade_id, score, max', color: 'teal' },
    { name: 'Placements', pk: 'placement_id, company', color: 'violet' },
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200 fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Comprehensive Database Design</h2>
          <p className="text-xl text-slate-600">12 interconnected tables ensuring absolute data integrity</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-${table.color}-500 hover:shadow-md transition-shadow`}
            >
              <h4 className="font-bold text-slate-800 text-sm mb-1">{table.name}</h4>
              <p className="text-xs text-slate-500 font-mono">{table.pk}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchemaDisplay;
