import React from 'react';

const FontList = ({ fonts }) => {
    return (
        <div className="font-list">
            <h3>Uploaded Fonts</h3>
            <ul>
                {fonts.map((font) => (
                    <li key={font.id} style={{ fontFamily: font.name }}>{font.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default FontList;
