import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useAuthContext } from '../../Auth/AuthContext';
import { useGetClinics } from '../Clinic/useClinic';
import { useDeleteDocument } from './usePatient';
import { useQueryClient } from '@tanstack/react-query';
import { useClinicContext } from '../../context/ClinicContext';

const columnHelper = createColumnHelper();

const PatientRecords = ({ records, isLoading, patientId }) => {
    const { user } = useAuthContext();
    const { selectedClinic } = useClinicContext();
    const { data: clinics } = useGetClinics(user?.roleId);

    const clinicId = selectedClinic?.clinicId;
    const queryClient = useQueryClient();

    const deleteDocumentMutation = useDeleteDocument({
        onSuccess: () => {
            queryClient.invalidateQueries(['documents', clinicId , patientId]);
        },
    });

    const handleDelete = (documentId) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            deleteDocumentMutation.mutate(documentId);
        }
    };

    const columns = useMemo(() => [
        columnHelper.accessor('reportType', {
            header: 'Report Type',
            cell: info => <span className="text-on-surface-variant">{info.getValue()}</span>,
        }),
        columnHelper.accessor('clinic', {
            header: 'Clinic',
            cell: info => <span className="text-on-surface-variant">{info.getValue()}</span>,
        }),
        columnHelper.accessor('dateUploaded', {
            header: 'Date Uploaded',
            cell: info => <span className="text-on-surface-variant">{info.getValue()}</span>,
        }),
        columnHelper.accessor('consentStatus', {
            header: 'Consent Status',
            cell: info => {
                const status = info.getValue();
                if (status === 'Granted') {
                    return (
                        <span className="inline-flex items-center gap-xs px-sm py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-[10px] uppercase">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span> Granted
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-xs px-sm py-1 bg-error-container text-on-error-container rounded-full font-label-md text-[10px] uppercase">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>lock</span> Restricted
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: props => {
                const document = props.row.original;
                const canDelete = clinics?.some(c => c.clinicId === document.originClinic?.clinicId);
                console.log(clinics)

                return (
                    <div className="text-right space-x-sm">
                        {document.consentStatus === 'Granted' ? (
                            <>
                                <a href={`https://localhost:7068${document.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary p-1.5 rounded transition-colors" title="View Report">
                                    <span className="material-symbols-outlined">visibility</span>
                                </a>
                                <a href={`https://localhost:7068${document.fileUrl}`} download className="text-primary p-1.5 rounded transition-colors" title="Download PDF">
                                    <span className="material-symbols-outlined">download</span>
                                </a>
                                {canDelete && (
                                    <button onClick={() => handleDelete(document.documentId)} className="text-error p-1.5 rounded transition-colors cursor-pointer" title="Delete Document">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                )}
                            </>
                        ) : (
                            <button className="text-secondary hover:bg-secondary/10 p-1.5 rounded transition-colors" title="Request Access">
                                <span className="material-symbols-outlined">lock</span>
                            </button>
                        )}
                    </div>
                )
            },
        }),
    ], [clinics, handleDelete]);

    const mappedRecords = useMemo(() => records.map(r => ({
        documentId: r.documentId,
        reportType: r.documentType,
        clinic: r.originClinic?.name,
        originClinic: r.originClinic,
        dateUploaded: new Date(r.uploadDate).toLocaleDateString(),
        consentStatus: 'Granted',
        fileUrl: r.fileUrl
    })), [records]);

    const table = useReactTable({
        data: mappedRecords,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return <div>Loading records...</div>
    }

    return (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-surface-container text-on-surface-variant font-label-md text-label-md border-b border-outline-variant">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-lg py-md font-semibold">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="text-body-sm divide-y divide-outline-variant">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-surface-container-low transition-colors group">
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
            {/* Pagination (can be added later) */}
            <div className="p-md bg-surface-container-low flex justify-between items-.center border-t border-outline-variant">
                <p className="text-label-md text-on-surface-variant">Showing {mappedRecords.length} of {mappedRecords.length} records</p>
            </div>
        </div>
    );
};

export default PatientRecords;
