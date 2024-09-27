import { errorMsg } from '../utils/alert';
import { http } from './http';
import axios from 'axios';

// CREATE METHOD CONFIGURATION
export function createMutationConfig(queryClient, key) {
  return {
    mutationFn: async ({ url, formData }) => {
      const response = await http.post(url, formData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      queryClient.setQueryData([key], (oldData) => {
        if (!oldData || !oldData[key]) {
          return oldData;
        }
        const newData = [...oldData[key], data.data];
        return { ...oldData, [key]: newData };
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        errorMsg('Error!', error.response?.data?.message);
      } else {
        console.error('An error occurred:', error);
      }
    },
  };
}

// CREATE METHOD CONFIGURATION JSON DATA
export function createJsonMutationConfig(queryClient, key) {
  return {
    mutationFn: async ({ url, data }) => {
      const response = await http.post(url, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      queryClient.setQueryData([key], (oldData) => {
        if (!oldData || !oldData[key]) {
          return oldData;
        }
        const newData = [...oldData[key], data.data];
        return { ...oldData, [key]: newData };
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        errorMsg('Error!', error.response?.data?.message);
      } else {
        console.error('An error occurred:', error);
      }
    },
  };
}

// UPDATE METHOD CONFIGURATION FORM DATA
export function updateFormMutationConfig(queryClient, key) {
  return {
    mutationFn: async ({ url, formData }) => {
      const response = await http.put(url, formData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      queryClient.setQueryData([key], (oldData) => {
        if (!oldData || !oldData[key]) {
          return oldData;
        }
        const filterData = oldData[key].filter(
          (item) => item._id !== data.data._id
        );
        const newData = [...filterData, data.data];
        return { ...oldData, [key]: newData };
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        errorMsg('Error!', error.response?.data?.message);
      } else {
        console.error('An error occurred:', error);
      }
    },
  };
}

// UPDATE METHOD CONFIGURATION JSON DATA
export function updateJsonMutationConfig(queryClient, key) {
  return {
    mutationFn: async ({ url, data }) => {
      const response = await http.put(url, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      queryClient.setQueryData([key], (oldData) => {
        if (!oldData || !oldData[key]) {
          return oldData;
        }
        const filterData = oldData[key].filter(
          (item) => item._id !== data.data._id
        );
        const newData = [...filterData, data.data];
        return { ...oldData, [key]: newData };
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        errorMsg('Error!', error.response?.data?.message);
      } else {
        console.error('An error occurred:', error);
      }
    },
  };
}

// DELETE METHOD CONFIGURATION
export function deleteMutationConfig(queryClient, key) {
  return {
    mutationFn: async (url) => {
      const id = url.substring(url.lastIndexOf('/') + 1);
      await http.delete(url);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      queryClient.setQueryData([key], (oldData) => {
        if (!oldData || !oldData[key]) {
          return oldData;
        }
        const filterData = oldData[key].filter((item) => item._id !== id);
        return { ...oldData, [key]: filterData };
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        errorMsg('Error!', error.response?.data?.message);
      } else {
        console.error('An error occurred:', error);
      }
    },
  };
}
