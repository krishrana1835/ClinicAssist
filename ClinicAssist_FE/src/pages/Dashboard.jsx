import { useState } from 'react';
import AddNewClinic from '../components/dashboard/AddNewClinic';
import ListClinics from '../components/dashboard/ListClinics';
import ListPatient from '../components/dashboard/ListPatient';

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

const clinicsList = [
    { name: "Downtown General", address: "451 Medical Plaza, NY 10001", patientsCount: "1,240", colorClass: "bg-primary" },
    { name: "North Star Clinic", address: "12 Health Way, NJ 07302", patientsCount: "890", colorClass: "bg-secondary" },
    { name: "Riverdale Pediatrics", address: "88 Riverside Dr, NY 10463", patientsCount: "562", colorClass: "bg-tertiary-container" },
];

export default function Dashboard() {
    const [selectedClinic, setSelectedClinic] = useState(null);

    const handleClinicClick = (clinicName) => {
        setSelectedClinic(clinicName);
        // Ensure scrolling slightly down to the patient list
        setTimeout(() => {
            document.getElementById('patientListSection')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
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
                <AddNewClinic />

                <section className="lg:col-span-8 space-y-md">
                    <ListClinics data={clinicsList} onClinicClick={handleClinicClick} />
                    <ListPatient data={initialPatientData} selectedClinic={selectedClinic} onClose={() => setSelectedClinic(null)} />
                </section>
            </div>
        </>
    );
}