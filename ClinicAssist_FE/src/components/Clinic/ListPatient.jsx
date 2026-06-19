import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { dateFormatter } from '../../utils/utils';

const columnHelper = createColumnHelper();
 
export default function ListPatient({ patients, selectedClinic, onClose }) { // Changed 'data' to 'patients'
    // The 'patients' prop is now expected to be an array of PatientListDto for the selected clinic.
    // No need for useMemo to filter from a larger data object.
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Patient Name',
            cell: info => <span className="font-body-md text-on-surface">{info.getValue()}</span>,
        }),
        columnHelper.accessor('lastVisit', {
            header: 'Last Visited',
            cell: info => <span className="font-body-sm text-on-surface-variant">{dateFormatter(info.getValue())}</span>,
        }),
        columnHelper.accessor('contactNumber', {
            header: 'Contact Number',
            cell: info => <span className="font-body-sm text-on-surface-variant">{info.getValue()}</span>,
        }),
        

        columnHelper.display({
            id: 'action',
            header: () => <div className="text-right">Quick Action</div>,
            cell: () => (
                <div className="text-right">
                    <button className="bg-surface border border-outline px-sm py-1 rounded hover:bg-surface-container-high transition-all text-xs font-bold text-on-surface cursor-pointer shadow-sm">
                        Record Visit
                    </button>
                </div>
            ),
        }),
    ], []); // Removed 'data' and 'selectedClinic' from dependencies as 'patients' is now directly passed

    const table = useReactTable({
        data: patients,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (!selectedClinic) {
        return (
            <div className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-outline text-[48px] mb-md opacity-40">group</span>
                <p className="font-body-md text-on-surface-variant">Select a clinic to view patient records</p>
            </div>
        );
    }

    return (
        <div id="patientListSection" className="animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-surface-container-lowest rounded-xl border-l-4 border-l-primary border border-outline-variant shadow-lg overflow-hidden">
                <div className="px-lg py-md flex justify-between items-center border-b border-outline-variant bg-surface-container-low/30">
                    <div>
                        <h4 className="font-headline-md text-headline-md text-on-surface">{selectedClinic} - Patient Roster</h4>
                        <p className="text-body-sm text-on-surface-variant">Active roster and recent check-ins.</p>
                    </div>
                    <button 
                        className="p-xs rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer flex items-center" 
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-md overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="border-b border-outline-variant">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className={`px-md py-sm font-label-md text-on-surface-variant font-semibold ${header.id === 'action' ? 'text-right' : ''}`}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-md py-md">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {patients.length === 0 && (
                                <tr> 
                                    <td colSpan={columns.length} className="px-md py-xl text-center text-on-surface-variant font-body-md">
                                        No patients found for this clinic.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}