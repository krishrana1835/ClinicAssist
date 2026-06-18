const RecentActivity = ({ activities, onViewAllClick, className = '' }) => {
    return (
        <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col ${className}`}>
            <div className="p-md lg:p-lg border-b border-outline-variant bg-surface-bright flex justify-between items-center">
                <div>
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Recent Activity</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Latest patient updates and actions</p>
                </div>
                <button 
                    onClick={onViewAllClick}
                    className="text-primary font-label-md text-label-md hover:underline flex items-center gap-xs"
                >
                    View All <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md border-b border-outline-variant">
                            <th className="py-sm px-md font-medium">Patient Name</th>
                            <th className="py-sm px-md font-medium">Activity Type</th>
                            <th className="py-sm px-md font-medium">Date &amp; Time</th>
                        </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-surface-variant">
                        {activities && activities.length > 0 ? (
                            activities.map((activity, index) => (
                                <tr key={index} className="hover:bg-surface-container-low transition-colors group">
                                    <td className="py-sm px-md font-medium flex items-center gap-sm">
                                        <div className={`w-8 h-8 rounded-full ${activity.avatarColorClass || 'bg-surface-variant text-on-surface'} flex items-center justify-center font-bold text-xs`}>
                                            {activity.initials}
                                        </div>
                                        {activity.name}
                                    </td>
                                    <td className="py-sm px-md">
                                        <div className="flex items-center gap-xs text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[16px]">{activity.icon}</span>
                                            {activity.type}
                                        </div>
                                    </td>
                                    <td className="py-sm px-md font-data-mono text-data-mono text-tertiary">{activity.dateTime}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-md px-md text-center text-on-surface-variant">No recent activity found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivity;