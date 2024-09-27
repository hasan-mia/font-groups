import React from 'react';
import { Table } from 'antd';

const FontGroupList = ({ fontGroups }) => {
    if (!Array.isArray(fontGroups)) {
        console.error("Expected 'fontGroups' to be an array, but got:", fontGroups);
        return null; 
    }

    // Define the columns for the table
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
    ];

    // Format data for Ant Design's Table
    const dataSource = fontGroups.map((group) => ({
        key: group?.id,
        name: group?.name,
        fonts: group?.fonts,
    }));

    return (
        <div className="font-group-list">
            <h3>Font Groups</h3>
            <Table 
                columns={columns} 
                dataSource={dataSource} 
                pagination={{ pageSize: 5 }}
                bordered 
            />
        </div>
    );
};

export default FontGroupList;
