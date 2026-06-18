import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../axios/axiosInstense';

export const useGetMedicines = (clinicId, options = {}) => {
	return useQuery({
		queryKey: ['medicines', clinicId],
		queryFn: () => api.get(`api/Medicine/List/${clinicId}`).then((res) => res.data.data),
		enabled: !!clinicId,
		...options,
	});
};

export const useCreateMedicine = (clinicId) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (medicineData) => {
			return api.post('api/Medicine', medicineData).then((res) => res.data.data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['medicines', clinicId] });
		},
	});
};

export const useUpdateMedicine = (clinicId) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ medicineId, medicineData }) => {
			return api.put(`api/Medicine/${medicineId}`, medicineData).then((res) => res.data.data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['medicines', clinicId] });
		},
	});
};

export const useDeleteMedicine = (clinicId) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (medicineId) => api.delete(`api/Medicine/${medicineId}`).then((res) => res.data.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['medicines', clinicId] });
		},
	});
};