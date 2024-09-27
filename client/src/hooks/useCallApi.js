
import { useQuery } from '@tanstack/react-query';
import { http } from '../config/http';

export function useCallApi(url, key) {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await http.get(url);
      return response.data;
    },
  });
}