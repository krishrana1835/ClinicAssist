import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteClinic } from './useClinic';

const columnHelper = createColumnHelper();

export default function ListClinics({ data, onClinicClick, onEditClinic }) {
    const deleteClinicMutation = useDeleteClinic();

    const handleEditClick = (clinic) => {
        // In a real application, this would open a modal or navigate to an edit page
        onEditClinic(clinic);
        // Example: updateClinicMutation.mutate({ clinicId, clinicData: { name: 'New Name', address: 'New Address' } });
    };

    const handleDeleteClick = (clinicId) => {
        if (window.confirm(`Are you sure you want to delete clinic with ID: ${clinicId}?`)) {
            deleteClinicMutation.mutate(clinicId);
        }
    };

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Clinic Name',
            cell: info => (
                <div className="flex items-center gap-sm">
                    <Link 
                        to={`/clinic/${info.row.original.clinicId}/settings`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
                        title="Clinic Settings"
                    >
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                    </Link>
                    <div className={`w-2 h-8 ${info.row.original.colorClass} rounded-full`}></div>
                    <span className="font-body-md font-semibold">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('address', {
            header: 'Address',
            cell: info => <span className="font-body-sm text-on-surface-variant">{info.getValue()}</span>,
        }),
        columnHelper.accessor('patientsCount', {
            header: 'Total Patients',
            cell: info => (
                <span className="px-sm py-xs bg-secondary-container/30 text-on-secondary-container rounded-full text-body-sm font-medium">
                    {info.row.original.totalPatients} Patients
                </span>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-center w-full">Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-center gap-2">
                    <button
                        className="text-primary font-bold hover:underline font-label-md bg-transparent border-none cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); handleEditClick(row.original); }}
                    >
                        Edit
                    </button>
                    <button
                        className="text-error font-bold hover:underline font-label-md bg-transparent border-none cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(row.original.clinicId); }}
                    >
                        Delete
                    </button>
                </div>
            ),
        }),
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md text-on-surface">Your Clinics</h3> 
            </div>

            {data?.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-container-low/50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className={`px-lg py-sm font-label-md text-on-surface-variant font-semibold ${header.id === 'actions' ? 'text-right' : ''}`}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                                    onClick={() => onClinicClick(row.original.name)} // Keep row clickable for viewing patients
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-lg py-md">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex p-4 justify-center text-gray-500">No Clinics Found</div>
            )}
        </div>
    );
}