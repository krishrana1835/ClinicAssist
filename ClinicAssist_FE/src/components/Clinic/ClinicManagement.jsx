import { useState } from 'react';
import ClinicActionModal from './ClinicActionModal';
import ListClinics from './ListClinics';
import ListPatient from './ListPatient';
import { useAuthContext } from '../../Auth/AuthContext';
import { useGetClinics } from './useClinic';

const initialPatientData = {
    "Downtown General": [
        { name: "Eleanor Rigby", lastVisit: "Oct 12, 2023", status: "Stable" },
        { name: "John Doe", lastVisit: "Oct 15, 2023", status: "Stable" },
        { name: "Sarah Smith", lastVisit: "Oct 20, 2023", status: "Review Required" }
    ],
    "North Star Clinic": [
        { name: "Michael Chang", lastVisit: "Sep 28, 2023", status: "Critical" },
        { name: "Alice Cooper", lastVisit: "Oct 05, 2023", status: "Stable" }
    ],
    "Riverdale Pediatrics": [
        { name: "Baby Jamie", lastVisit: "Oct 18, 2023", status: "Stable" },
        { name: "Sophie Turner", lastVisit: "Oct 19, 2023", status: "Routine" }
    ]
};

export default function ClinicManagement() {
    const { user } = useAuthContext();
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [editingClinic, setEditingClinic] = useState(null);

    const { data: clinicsList = [] } = useGetClinics(user.roleId);

    const handleClinicClick = (clinicName) => {
        setSelectedClinic(clinicName);
        setTimeout(() => {
            document.getElementById('patientListSection')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    const handleCloseEdit = () => {
        setEditingClinic(null);
    };

    const handleEditClinic = (clinic) => {
        setEditingClinic(clinic);
        document.getElementById('ClinicActionModalSection')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Clinic Management</h2>
                    <p className="font-body-md text-on-surface-variant">Oversee multi-location operations and patient distribution.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
                <div id="ClinicActionModalSection" className="lg:col-span-4">
                    <ClinicActionModal clinicToEdit={editingClinic} onClose={handleCloseEdit} />
                </div>

                <section className="lg:col-span-8 space-y-md">
                    <ListClinics data={clinicsList} onClinicClick={handleClinicClick} onEditClinic={handleEditClinic} />
                    <ListPatient data={initialPatientData} selectedClinic={selectedClinic} onClose={() => setSelectedClinic(null)} />
                </section>
            </div>
        </>
    );
}