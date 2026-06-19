import { useState, useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { useGetFilteredPatients } from '../Clinic/useClinic';
import { dateFormatter } from '../../utils/utils';
import { useGetClinics } from '../Clinic/useClinic';
import { useAuthContext } from '../../Auth/AuthContext'

const columnHelper = createColumnHelper();

// Custom debounce hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function PatientDirectory() {

	const { user } = useAuthContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [clinicFilter, setClinicFilter] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Debounced values for API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const debouncedClinicFilter = useDebounce(clinicFilter, 500);
    const debouncedStartDate = useDebounce(dateRange.startDate, 500);

	const { data: mockClinics = [] } = useGetClinics(user?.roleId);

    const {
        data: patientData,
        isLoading,
        isError,
        error,
    } = useGetFilteredPatients(
        user?.roleId,
        debouncedSearchTerm,
        debouncedClinicFilter,
        debouncedStartDate,
        currentPage,
        pageSize
    );

    const patients = patientData?.patients || [];
    const totalPatients = patientData?.totalCount || 0;
    const totalPages = patientData?.totalPages || 1;

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Patient Name',
            cell: info => (
                <div className="flex items-center gap-md">
                    <div className="flex flex-col">
                        <span className="text-on-surface font-semibold text-body-sm">{info.getValue()}</span>
                        <span className="text-on-surface-variant text-xs">ID: {info.row.original.patientId}</span>
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('dob', {
            header: 'DOB',
            cell: info => <span className="p-md text-on-surface-variant text-body-sm">{dateFormatter(info.getValue())}</span>,
        }),
        columnHelper.accessor('bloodGroup', {
            header: 'Blood Group',
            cell: info => <span className="p-md text-on-surface-variant text-body-sm">{info.getValue()}</span>,
        }),
        columnHelper.accessor('contactNumber', {
            header: 'Contact Number',
            cell: info => <span className="p-md text-on-surface-variant text-body-sm">{info.getValue()}</span>,
        }),
        columnHelper.accessor('lastVisit', {
            header: 'Last Visit',
            cell: info => <span className="p-md text-on-surface-variant text-body-sm">{dateFormatter(info.getValue())}</span>,
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right w-full">Actions</div>,
            cell: () => (
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-primary hover:bg-primary-container/10 p-2 rounded-lg transition-colors text-body-sm font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        View
                    </button>
                    <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition-all">New Case</button>
                </div>
            ),
        }),
    ], []);

    const table = useReactTable({
        data: patients,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleClinicFilterChange = (e) => {
        setClinicFilter(e.target.value);
        setCurrentPage(1); // Reset to first page on new filter
    };

    const handleDateRangeChange = (e) => {
        // For simplicity, assuming a single date input for 'last visit'
        // In a real app, this would be a date range picker
        setDateRange({ startDate: e.target.value, endDate: e.target.value });
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setClinicFilter('');
        setDateRange({ startDate: null, endDate: null });
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 5; // Max number of page buttons to show

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            buttons.push(1);
            if (currentPage > 2) {
                buttons.push('...');
            }
            if (currentPage > 1 && currentPage < totalPages) {
                buttons.push(currentPage);
            }
            if (currentPage < totalPages - 1) {
                buttons.push('...');
            }
            buttons.push(totalPages);
        }
        return [...new Set(buttons)]; // Remove duplicates
    };


    return (
        <div className="flex flex-col gap-lg max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Patient Directory</h2>
                    <p className="font-body-md text-on-surface-variant">Manage and view all patient records.</p>
                </div>
            </div>

            {/* Professional Filter Bar */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-md items-end">
                    {/* Search */}
                    <div className="flex flex-col gap-xs">
                        <label className="font-label-md text-on-surface-variant">Patient Name</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-body-sm"
                                placeholder="Search records..."
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    {/* Clinic Filter */}
                    <div className="flex flex-col gap-xs">
                        <label className="font-label-md text-on-surface-variant">Clinic Location</label>
                        <select
                            className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-body-sm bg-white appearance-none cursor-pointer"
                            value={clinicFilter}
                            onChange={handleClinicFilterChange}
                        >
                            <option value="">All Clinics</option>
                            {mockClinics.map(clinic => (
                                <option key={clinic.clinicId} value={clinic.clinicId}>{clinic.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Date Picker Placeholder */}
                    <div className="flex flex-col gap-xs">
                        <label className="font-label-md text-on-surface-variant">Last Visit Date</label>
                        <div className="relative group">
                            <input
                                className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-body-sm bg-white"
                                placeholder="Select range"
                                type="date" // Changed to date type for better UX
                                value={dateRange.startDate || ''} // Only show start date for simplicity
                                onChange={handleDateRangeChange}
                            />
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-sm">
                        <button
                            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors shrink-0"
                            title="Clear Filters"
                            onClick={handleClearFilters}
                        >
                            <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Patient Table */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-surface-container-low border-b border-outline-variant">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className={`p-md font-label-md text-on-surface-variant uppercase tracking-wider ${header.id === 'actions' ? 'text-right' : ''}`}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="p-md text-center text-on-surface-variant">Loading patients...</td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={columns.length} className="p-md text-center text-error">Error: {error.message}</td>
                                </tr>
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="p-md text-center text-on-surface-variant">No patients found.</td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-surface-container transition-colors group">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="p-md">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer */}
                <div className="p-md flex items-center justify-between border-t border-outline-variant bg-surface-container-low">
                    <div className="flex items-center gap-4">
                        <span className="text-on-surface-variant text-xs">
                            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalPatients)} of {totalPatients} patients
                        </span>
                        <div className="flex items-center gap-2">
                            <label htmlFor="pageSize" className="text-on-surface-variant text-xs">Rows per page:</label>
                            <select
                                id="pageSize"
                                value={pageSize}
                                onChange={e => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="p-1 rounded-md border-outline-variant bg-surface-container-lowest text-xs focus:ring-2 focus:ring-primary-container focus:border-primary outline-none"
                            >
                                {[10, 20, 50, 100].map(size => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 rounded-lg hover:bg-surface-variant transition-colors disabled:opacity-30"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <div className="flex items-center gap-1">
                            {getPaginationButtons().map((pageNumber, index) => (
                                pageNumber === '...' ? (
                                    <span key={index} className="mx-1">...</span>
                                ) : (
                                    <button
                                        key={index}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold ${currentPage === pageNumber ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant text-on-surface-variant'}`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            ))}
                        </div>
                        <button
                            className="p-2 rounded-lg hover:bg-surface-variant transition-colors disabled:opacity-30"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}