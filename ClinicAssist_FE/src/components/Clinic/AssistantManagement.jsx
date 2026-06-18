import { useState } from 'react';

export default function AssistantManagement() {
    const [staff, setStaff] = useState([
        {
            id: 1,
            initials: 'SJ',
            name: 'Sarah Jenkins',
            email: 'sarah.j@clinicassist.com',
            avatarBg: 'bg-primary-fixed text-on-primary-fixed',
            permissions: {
                viewPrescriptions: true,
                createPrescriptions: false,
                viewReports: true,
                uploadReports: true,
            },
            isActive: true,
        },
        {
            id: 2,
            initials: 'MR',
            name: 'Michael Rodriguez',
            email: 'm.rodriguez@clinicassist.com',
            avatarBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
            permissions: {
                viewPrescriptions: true,
                createPrescriptions: true,
                viewReports: true,
                uploadReports: true,
            },
            isActive: true,
        },
        {
            id: 3,
            initials: 'EL',
            name: 'Emily Chen',
            email: 'e.chen@clinicassist.com',
            avatarBg: 'bg-surface-variant text-on-surface-variant',
            permissions: {
                viewPrescriptions: false,
                createPrescriptions: false,
                viewReports: false,
                uploadReports: false,
            },
            isActive: false,
        },
    ]);

    const handlePermissionChange = (staffId, permissionType) => {
        setStaff(prevStaff =>
            prevStaff.map(member =>
                member.id === staffId
                    ? {
                          ...member,
                          permissions: {
                              ...member.permissions,
                              [permissionType]: !member.permissions[permissionType],
                          },
                      }
                    : member
            )
        );
    };

    const handleToggleStatus = (staffId) => {
        setStaff(prevStaff =>
            prevStaff.map(member => {
                if (member.id === staffId) {
                    const newIsActive = !member.isActive;
                    // If deactivating, also disable all permissions
                    const updatedPermissions = newIsActive
                        ? member.permissions // Keep existing permissions if activating
                        : {
                              viewPrescriptions: false,
                              createPrescriptions: false,
                              viewReports: false,
                              uploadReports: false,
                          };
                    return {
                        ...member,
                        isActive: newIsActive,
                        permissions: updatedPermissions,
                    };
                }
                return member;
            })
        );
    };

    return (
        <div className="block animate-fade-in" id="content-assistants">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-md">
                <div className="relative w-full max-w-sm">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body-sm text-body-sm bg-surface" placeholder="Search staff..." type="text" />
                </div>
                <button className="bg-surface text-primary border border-outline-variant px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors ml-4 shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                    Invite Staff
                </button>
            </div>

            {/* Assistants Table Card */}
            <div className="bg-surface rounded-xl border border-surface-variant shadow-sm overflow-hidden flex flex-col relative">
                {/* Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
                <div className="table-container overflow-x-auto pl-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-low">
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Staff Member</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">View Prescriptions</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Create Prescriptions</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">View Reports</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Upload Reports</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="font-body-sm text-body-sm">
                            {staff.map((member) => (
                                <tr key={member.id} className={`border-b border-outline-variant hover:bg-surface-container-lowest transition-colors ${!member.isActive ? 'bg-surface-container-low bg-opacity-30' : ''}`}>
                                    <td className="p-4">
                                        <div className={`flex items-center gap-3 ${!member.isActive ? 'opacity-60' : ''}`}>
                                            <div className={`w-10 h-10 rounded-full ${member.avatarBg} flex items-center justify-center font-bold text-sm`}>{member.initials}</div>
                                            <div>
                                                <div className={`font-medium text-on-surface ${!member.isActive ? 'line-through' : ''}`}>{member.name}</div>
                                                <div className="text-on-surface-variant text-xs">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            className={`w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary ${member.isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                            checked={member.permissions.viewPrescriptions}
                                            onChange={() => handlePermissionChange(member.id, 'viewPrescriptions')}
                                            disabled={!member.isActive}
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            className={`w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary ${member.isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                            checked={member.permissions.createPrescriptions}
                                            onChange={() => handlePermissionChange(member.id, 'createPrescriptions')}
                                            disabled={!member.isActive}
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            className={`w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary ${member.isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                            checked={member.permissions.viewReports}
                                            onChange={() => handlePermissionChange(member.id, 'viewReports')}
                                            disabled={!member.isActive}
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            className={`w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary ${member.isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                            checked={member.permissions.uploadReports}
                                            onChange={() => handlePermissionChange(member.id, 'uploadReports')}
                                            disabled={!member.isActive}
                                        />
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`text-xs ${member.isActive ? 'text-on-surface-variant' : 'text-outline'}`}>
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                                <input
                                                    type="checkbox"
                                                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-all duration-200"
                                                    id={`toggle-${member.id}`}
                                                    checked={member.isActive}
                                                    onChange={() => handleToggleStatus(member.id)}
                                                />
                                                <label
                                                    htmlFor={`toggle-${member.id}`}
                                                    className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-variant cursor-pointer transition-colors duration-200"
                                                ></label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}