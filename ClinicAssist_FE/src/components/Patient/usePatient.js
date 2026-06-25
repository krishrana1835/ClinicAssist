import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../axios/axiosInstense';

const getPatientById = async (patientId) => {
    const response = await api.get(`/api/Patient/${patientId}`);
    return response.data.data;
};

const getPatientDocuments = async (clinicId, patientId) => {
    const response = await api.get(`/api/Document/List/Clinic/${clinicId}/Patient/${patientId}`);
    return response.data.data;
};

const fetchFilteredPatients = async ({ queryKey }) => {
    const [, { doctorId, name, clinicId, lastVisit, page, pageSize }] = queryKey;
    const params = {
        name,
        clinicId,
        lastVisit,
        page,
        pageSize,
    };
    // Filter out undefined or null values from params
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );

    const { data } = await api.get(`/api/Clinic/Patient/Filter/${doctorId}`, { params: filteredParams });
    return data.data;
};

export const useGetPatientById = (patientId) => {
    return useQuery({
        queryKey: ['patient', patientId],
        queryFn: () => getPatientById(patientId),
        enabled: !!patientId,
    });
};

export const useGetPatientDocuments = (clinicId, patientId) => {
    return useQuery({
        queryKey: ["documents", clinicId, patientId],
        queryFn: () => getPatientDocuments(clinicId, patientId),
        enabled: !!clinicId && !!patientId,
    });
};

export const useUploadDocument = (options = {}) => {
    return useMutation({
        mutationFn: (formData) => {
            return api.post("/api/Document/Upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        ...options,
    });
};

export const useDeleteDocument = (options = {}) => {
    return useMutation({
        mutationFn: (documentId) => {
            return api.delete(`/api/Document/${documentId}`);
        },
        ...options,
    });
};

export const useGetFilteredPatients = (doctorId, name, clinicId, lastVisit, page, pageSize) => {
    return useQuery({
        queryKey: ['filteredPatients', { doctorId, name, clinicId, lastVisit, page, pageSize }],
        queryFn: fetchFilteredPatients,
        enabled: !!doctorId, // Only fetch if doctorId is available
        keepPreviousData: true,
    });
};