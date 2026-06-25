import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useGetClinics } from '../components/Clinic/useClinic';
import { useAuthContext } from '../Auth/AuthContext';

const ClinicContext = createContext();

export const ClinicProvider = ({ children }) => {
    const { user } = useAuthContext();
    // Fetch all clinics once in the provider
    const { data: clinicsList = [], isLoading: isLoadingClinics } = useGetClinics(user?.roleId);
    const [selectedClinicId, setSelectedClinicId] = useState(null);

    // Set a default clinic when the list loads
    useEffect(() => {
        if (!selectedClinicId && clinicsList.length > 0) {
            setSelectedClinicId(clinicsList[0].clinicId);
        }
    }, [clinicsList, selectedClinicId]);

    // Memoize the selected clinic object to prevent unnecessary re-renders
    const selectedClinic = useMemo(() => {
        return clinicsList.find(c => c.clinicId === selectedClinicId) || null;
    }, [selectedClinicId, clinicsList]);

    const value = {
        clinicsList,
        isLoadingClinics,
        selectedClinic,
        setSelectedClinicId, // Expose setter to allow components to change the clinic
    };

    return (
        <ClinicContext.Provider value={value}>
            {children}
        </ClinicContext.Provider>
    );
};

export const useClinicContext = () => useContext(ClinicContext)