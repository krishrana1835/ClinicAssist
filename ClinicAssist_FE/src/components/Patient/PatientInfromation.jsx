import { useState } from 'react';
import { useParams } from 'react-router-dom';

import PatientRecords from './PatientRecords';
import UploadDocumentModal from './UploadDocumentModal';
import { useClinicContext } from '../../context/ClinicContext';
import { useGetPatientById, useGetPatientDocuments } from './usePatient';

const PatientInfromation = () => {
  const { patientId } = useParams();
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const { selectedClinic } = useClinicContext();
  const { data: patient, isLoading: isPatientLoading, error: patientError } = useGetPatientById(patientId);
  const { data: records, isLoading: areRecordsLoading } = useGetPatientDocuments(selectedClinic?.clinicId, patientId);

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isPatientLoading) {
    return <div>Loading...</div>;
  }

  if (patientError) {
    return <div>Error: {patientError.message}</div>;
  }

  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <main className="">
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        patientId={patientId}
        selectedClinic={selectedClinic}
      />
      {/* Page Header */}
      <div className="mb-xxl">
        <h3 className="font-headline-lg text-headline-lg text-primary mb-xs">Patient Records &amp; Reports</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage and view patient medical documentation and consent settings.</p>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg mb-xl flex flex-col md:flex-row gap-lg items-start md:items-center">
        <div className="w-24 h-24 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-3xl">
          {patient.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-md mb-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface">{patient.name}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-body-sm text-on-surface-variant">
            <div><span className="font-semibold block text-xs uppercase text-outline">Age</span>{calculateAge(patient.dob)}</div>
            <div><span className="font-semibold block text-xs uppercase text-outline">Gender</span>{patient.gender}</div>
            <div><span className="font-semibold block text-xs uppercase text-outline">Blood Group</span>{patient.bloodGroup || 'N/A'}</div>
            <div><span className="font-semibold block text-xs uppercase text-outline">Weight</span>{patient.weight} kg</div>
          </div>
          <div className="mt-md flex items-center gap-md text-body-sm text-primary">
            <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-lg">mail</span>{patient.email}</span>
            <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-lg">call</span>{patient.contactNo}</span>
          </div>
        </div>
        <div className="flex gap-sm">
            <button
                onClick={() => setUploadModalOpen(true)}
                className="px-md py-2 bg-primary text-white rounded-lg font-label-md text-sm hover:bg-primary-dark transition-colors"
            >
                Upload Report
            </button>
          <button className="px-md py-2 border border-outline-variant text-on-surface rounded-lg font-label-md text-sm hover:bg-surface-container-low transition-colors">History</button>
        </div>
      </div>
      <PatientRecords records={records || []} isLoading={areRecordsLoading} />
    </main>
  );
};


export default PatientInfromation;
