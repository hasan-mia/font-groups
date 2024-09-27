import React, { useState } from 'react';
import { useFonts } from '../hooks/useFonts';

const FontGroup = () => {
    const {fonts} = useFonts();
    const [groupTitle, setGroupTitle] = useState('');
    const [selectedFonts, setSelectedFonts] = useState([]);

    const handleFontSelect = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedFonts([...selectedFonts, value]);
        } else {
            setSelectedFonts(selectedFonts.filter((font) => font !== value));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fontGroup = { title: groupTitle, fonts: selectedFonts };

        try {
            const response = await fetch('/api/font-groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fontGroup),
            });
            console.log(response)
            // const result = await response.json();
            // if (result.success) {
            //     addFontGroup(result?.group);
            // }
        } catch (error) {
            console.error('Error creating font group:', error);
        }
    };

    return (
        <div className="font-group">
            <h3>Create Font Group</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Group Title"
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    required
                />
                <div className="font-selection">
                    {fonts && fonts?.data?.map((font) => (
                        <div key={font?.id}>
                            <input
                                type="checkbox"
                                value={font?.name}
                                onChange={handleFontSelect}
                            />
                            <label style={{ fontFamily: font?.name }}>{font?.name}</label>
                        </div>
                    ))}
                </div>
                <button type="submit">Create Font Group</button>
            </form>
        </div>
    );
};

export default FontGroup;
