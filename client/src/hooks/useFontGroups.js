import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCallApi } from './useCallApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMutationConfig } from '../config/api';
import { errorMsg, successMsg } from '../utils/alert';

export function useFontGroups () {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const { data: fontGroups, isPending, refetch } = useCallApi(`${process.env.REACT_APP_API_URL}/fontgroups?page=${currentPage}&per_page=${encodeURIComponent(limit)}`, 'fontGroups');

    // ==========Handle Delete========
    const deleteMutation = useMutation(
      deleteMutationConfig(queryClient, "fontGroups"),
    );
    const handleDelete = async (id) => {
      try {
        const response = await deleteMutation.mutateAsync(
          `${process.env.REACT_APP_API_URL}/fontgroups/${id}`,
        );
        if (response) {
          successMsg("Success!", "Deleted successfully");
        }
      } catch (error) {
        errorMsg("Error!", error?.response?.data?.message);
      }
    };
       
    // ==========Handle Pagination========
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const fetchData = useCallback(async () => {
      await refetch();
    }, [refetch]);

    const memoizedFetchData = useMemo(() => fetchData, [fetchData]);

    useEffect(() => {
      memoizedFetchData();
      const timeout = setTimeout(() => {
        memoizedFetchData();
      }, 500);

      return () => clearTimeout(timeout);
    }, [memoizedFetchData, currentPage, limit]);

    return {
      fontGroups,
      isPending,
      currentPage,
      setCurrentPage,
      handlePageChange,
      limit,
      setLimit,
      handleDelete,
    };
}
