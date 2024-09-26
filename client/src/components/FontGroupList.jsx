import React from 'react';

const FontGroupList = ({ fontGroups }) => {
    return (
        <div className="font-group-list">
            <h3>Font Groups</h3>
            <ul>
                {fontGroups.map((group) => (
                    <li key={group.id}>
                        <strong>{group.name}</strong>: {group.fonts.join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FontGroupList;
