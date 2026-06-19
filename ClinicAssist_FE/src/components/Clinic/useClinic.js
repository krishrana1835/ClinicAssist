import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../axios/axiosInstense';

export const useCreateClinic = (options = {}) => {
	const queryClinet = useQueryClient();
	return useMutation({
		mutationFn: (clinicData) => {
			return api.post('api/Clinic', clinicData).then((res) => res.data.data);
		},
		onSuccess: () => {
			queryClinet.invalidateQueries({ queryKey: ['clinics'] });
			queryClinet.invalidateQueries({ queryKey: ['doctorProfile'] }); // Invalidate patients to refresh patient lists
		},
		...options,
	});
};

export const useGetClinics = (doctor_id, options = {}) => {
	return useQuery({
		queryKey: ['clinics', doctor_id],
		queryFn: () => api.get(`api/Clinic/${doctor_id}`).then((res) => res.data.data),
		enabled: !!doctor_id,
		...options,
	});
}

// Custom hook to update an existing clinic
export const useUpdateClinic = (options = {}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ clinicId, clinicData }) => {
			return api.put(`api/Clinic/${clinicId}`, clinicData).then((res) => res.data.data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['clinics'] });
		},
		...options,
	});
};

export const useDeleteClinic = (options = {}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (clinicId) => api.delete(`api/Clinic/${clinicId}`).then((res) => res.data.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['clinics'] });
			queryClient.invalidateQueries({ queryKey: ['doctorProfile'] }); // Invalidate patients to refresh patient lists
		},
		...options,
	});
};

export const useGetClinicPatients = (clinicId, recent, options = {}) => {
	return useQuery({
		queryKey: ['clinicPatients', clinicId, recent],
		queryFn: () => api.get(`api/Clinic/Patient/${clinicId}?recent=${recent}`).then((res) => res.data.data),
		enabled: !!clinicId,
		...options,
	})
}

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

export const useGetFilteredPatients = (doctorId, name, clinicId, lastVisit, page, pageSize) => {
    return useQuery({
        queryKey: ['filteredPatients', { doctorId, name, clinicId, lastVisit, page, pageSize }],
        queryFn: fetchFilteredPatients,
        enabled: !!doctorId, // Only fetch if doctorId is available
        keepPreviousData: true,
    });
};