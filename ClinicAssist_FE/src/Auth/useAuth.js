import { useMutation } from '@tanstack/react-query';
import api from '../axios/axiosInstense';

export const useLogin = (options = {}) => {
  return useMutation({
    mutationFn: (credentials) => {
      return api.post('api/Auth/Login', credentials).then((res) => res.data.data);
    },
    ...options,
  });
};

export const useRegisterDoctor = (options = {}) => {
  return useMutation({
    mutationFn: (doctorData) => {
      const dto = {
        email: doctorData.email,
        password: doctorData.password,
        name: doctorData.name,
        specialization: doctorData.specialization,
        contactNo: doctorData.contactNumber,
      };
      return api.post('api/Doctor', dto).then((res) => res.data);
    },
    ...options,
  });
};

export const useRegisterPatient = (options = {}) => {
  return useMutation({
    mutationFn: (patientData) => {
      const dto = {
        email: patientData.email,
        password: patientData.password,
        name: patientData.name,
        contactNo: patientData.contactNumber,
        dob: patientData.dob,
        bloodGroup: patientData.bloodGroup,
        weight: patientData.weight,
      };
      return api.post('api/Patient', dto).then((res) => res.data);
    },
    ...options,
  });
};