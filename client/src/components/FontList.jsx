import React from 'react';
import { Button, Skeleton } from 'antd';
import { IoTrashBinOutline } from 'react-icons/io5';
import AntTable from './table/AntTable';
import { useFonts } from '../hooks/useFonts';
import { useFontLoader } from '../hooks/useFontLoader';

const FontList = () => {
    const {
        fonts, 
        isPending,
        currentPage,
        handlePageChange,
        setLimit,
        setCurrentPage,
        handleDelete,
    } = useFonts();

    if (isPending) {
        return (
        <div className="bg-gray-100 border rounded py-5 px-2">
            <Skeleton active />
            <Skeleton active className="mt-4 text-red-600" />
        </div>
        );
    }

    const FontPreview = ({ record }) => {
        const fontFamily = `custom-font-${record.id}`;
        const fontLoaded = useFontLoader(record.path, fontFamily);

        if (!fontLoaded) {
            return <span>Loading font...</span>;
        }

        return (
            <span style={{ fontFamily, fontSize: '16px' }}>
                My Bangladesh
            </span>
        );
    };

    const columns = [
        {
            title: 'Font Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontFamily: text }}>{text}</span>,
        },
        {
            title: 'Preview',
            key: 'fontStyle',
            render: (_, record) => <FontPreview record={record} />,
        },
        {
            title: 'Delete',
            key: 'id',
            render: (value, record) => (
                <div className="flex gap-2">
                <div>
                    <Button onClick={()=>handleDelete(record.id)}>
                        <IoTrashBinOutline className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
                </div>
            ),
        },
    ];


    return (
        <div className="text-lg p-2">
            <h3 className='text-lg font-semibold p-2 border-b'>Uploaded Fonts</h3>
            <AntTable
                columns={columns}
                data={fonts}
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

export default FontList;
