import React from 'react';
import { Button, Skeleton } from 'antd';
import { IoTrashBinOutline } from 'react-icons/io5';
import AntTable from './table/AntTable';
import { useFonts } from '../hooks/useFonts';

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
    const columns = [
        {
            title: 'Font Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontFamily: text }}>{text}</span>,
        },
        {
            title: 'Font Style',
            key: 'fontStyle',
            render: (value, record) => {
                // Create a unique font family name based on the font ID
                const fontFamily = `custom-font-${record.id}`;
                
                // Dynamically add a @font-face rule
                const fontFace = new FontFace(
                    fontFamily,
                    `url(${record.path})`
                );

                // Load the font and add it to the document
                fontFace.load().then((loadedFont) => {
                    document.fonts.add(loadedFont);
                }).catch((error) => {
                    console.error('Failed to load font:', error);
                });

                // Apply the custom font to the "My Bangladesh" text
                return <span style={{ fontFamily }}>My Bangladesh</span>;
            },
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

    console.log(fonts.data)

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
