import React from 'react';
import { Table } from 'antd';

const FontList = ({ fonts, total, currentPage, setCurrentPage}) => {
    const columns = [
        {
            title: 'Font Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontFamily: text }}>{text}</span>,
        },
        {
            title: 'Font ID',
            dataIndex: 'id',
            key: 'id',
        },
    ];

    const dataSource = fonts.map((font) => ({
        key: font?.id,
        name: font?.name,
        id: font?.id,
    }));

    return (
        <div className="font-list">
            <h3>Uploaded Fonts</h3>
            <Table 
                columns={columns} 
                dataSource={dataSource} 
                pagination={{
                    pageSize: 5,
                    total: total, 
                    current: currentPage,
                    onChange: (page) => setCurrentPage(page),
                }}
                bordered 
            />
        </div>
    );
};

export default FontList;
