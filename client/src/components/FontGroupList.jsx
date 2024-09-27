import React from 'react';
import { Button, Skeleton } from 'antd';
import { useFontGroups } from '../hooks/useFontGroups';
import AntTable from './table/AntTable';
import { IoTrashBinOutline } from 'react-icons/io5';

const FontGroupList = () => {
    const {
        fontGroups, 
        isPending,
        currentPage,
        handlePageChange,
        setLimit,
        setCurrentPage,
        handleDelete,
    } = useFontGroups();

    if (isPending) {
        return (
        <div className="bg-gray-100 border rounded py-5 px-2">
            <Skeleton active />
            <Skeleton active className="mt-4" />
        </div>
        );
    }
 
    const columns = [
        {
            title: 'Group Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Fonts in Group',
            dataIndex: 'fonts',
            key: 'fonts',
            render: (fonts) => (Array.isArray(fonts) ? fonts.join(', ') : fonts),
        },
        {
            title: 'Delete',
            key: 'id',
            render: (value, record) => (
                <div className="flex gap-2">
                <div>
                    <Button onClick={()=>handleDelete(record?.id)}>
                        <IoTrashBinOutline className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
                </div>
            ),
        },
    ];

    return (
        <div className="text-lg p-2">
            <h3 className='text-lg font-semibold p-2 border-b'>Font Groups</h3>
            <AntTable
                columns={columns}
                data={fontGroups}
                isExpand={false}
                // expandedData={expandedData}
                isPaginate={true}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                setLimit={setLimit}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default FontGroupList;
