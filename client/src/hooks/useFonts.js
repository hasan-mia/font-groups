import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCallApi } from './useCallApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJsonMutationConfig, deleteMutationConfig } from '../config/api';
import { errorMsg, successMsg } from '../utils/alert';

export function useFonts () {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const { data: fonts, isPending, refetch } = useCallApi(`${process.env.REACT_APP_API_URL}/fonts?page=${currentPage}&per_page=${encodeURIComponent(limit)}`, 'fonts');

    // Use mutation
    const addFontMutation = useMutation(
        createJsonMutationConfig(queryClient, 'fonts')
    );
    
    // Handle add font
    const handleAddFont = async (data) => {
        const fontData = {
            name: data.originalFileName,
            path: data.fileUrl,
            size: data.fileSize,
        };

        try {
            await addFontMutation.mutateAsync({
                url: `${process.env.REACT_APP_API_URL}/fonts`,
                data: fontData,
            });
            successMsg('Success!', 'Font added successfully!');
            queryClient.invalidateQueries(['fonts']);
        } catch (error) {
            console.error('Error adding font:', error);
            errorMsg('Error!', 'Failed to add font.');
        }
    };

    // ==========Handle Delete========
	const deleteMutation = useMutation(
		deleteMutationConfig(queryClient, "fonts"),
	);
	const handleDelete = async (id) => {
		try {
			const response = await deleteMutation.mutateAsync(
				`${process.env.REACT_APP_API_URL}/fonts/${id}`,
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
        fonts,
        isPending,
        currentPage,
        setCurrentPage,
        handlePageChange,
        limit,
        setLimit,
        handleAddFont,
        handleDelete,
    };
}
