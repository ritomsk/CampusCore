const StatCard = ({ icon, iconColor, value, label, title, trend, onClick, badge, color }) => {
  const Component = onClick ? 'button' : 'div';
  const Icon = icon;
  
  // Use title if provided, otherwise fall back to label
  const displayLabel = title || label;
  
  // Use color prop if provided, otherwise fall back to iconColor
  const cardColor = color || iconColor || 'blue';

  // Color map for background and text
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <Component
      onClick={onClick}
      className={`stat-card bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-shadow ${
        onClick ? 'cursor-pointer group' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[cardColor] || colorClasses.blue}`}>
          {Icon && typeof Icon === 'function' ? (
            <Icon className="w-6 h-6" />
          ) : (
            <i className={`fas ${icon}`}></i>
          )}
        </div>
        {trend && (
          <span className="text-xs text-emerald-500 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
        {badge && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${badge.color}`}>
            {badge.text}
          </span>
        )}
        {onClick && (
          <i className="fas fa-arrow-right text-slate-300 group-hover:text-blue-500 transition"></i>
        )}
      </div>
      <p className="text-4xl font-extrabold text-slate-900 mb-2">{value}</p>
      <p className="text-sm font-medium text-slate-600">{displayLabel}</p>
    </Component>
  );
};

export default StatCard;
