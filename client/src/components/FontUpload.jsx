import React, { useState } from 'react';

const FontUpload = ({ addFont }) => {
    const [error, setError] = useState('');

    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];

        if (file && file.type === 'font/ttf') {
            setError('');

            // Send font to the backend API
            const formData = new FormData();
            formData.append('font', file);

            try {
                const response = await fetch('/api/upload-font', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (result.success) {
                    addFont(result.font); // Update font list dynamically
                }
            } catch (error) {
                console.error('Error uploading font:', error);
            }
        } else {
            setError('Only TTF files are allowed');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div 
            className="upload-box"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
        >
            <p>Click to upload or drag and drop</p>
            <p>Only TTF File Allowed</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FontUpload;
