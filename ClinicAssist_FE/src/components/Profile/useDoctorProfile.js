import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../axios/axiosInstense';

export const useGetDoctorProfile = (doctorId, options = {}) => {
	return useQuery({
		queryKey: ['doctorProfile', doctorId],
		queryFn: async () => api.get(`api/Doctor/${doctorId}`).then(res => res.data.data),
		...options
	});
}

export const useUpdateDoctorProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({doctorId, doctorData}) => {
			return api.put(`api/Doctor/${doctorId}`, doctorData).then(res => res.data.data); // Assuming res.data contains message
		},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
        },
    });
};

export const useUpdateDoctorPassword = () => {
    return useMutation({
        mutationFn: ({ userId, password }) => api.put(`api/Users/Password/${userId}`, { password }).then(res => res.data.data),
    });
};