import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { IoCloudUploadOutline } from "react-icons/io5";

const { Dragger } = Upload;

const FontUpload = ({ addFont }) => {
    const [error, setError] = useState('');

    const props = {
        name: 'file',
        multiple: false,
        accept: '.ttf',
        action: `${process.env.REACT_APP_API_URL}/upload`,

        onChange(info) {
            const { status, response } = info.file;

            if (status === 'done') {
                if (response && response.message === "File uploaded successfully.") {
                    handleFont(response.data)
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else {
                    message.error('File upload failed. Please try again.');
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                setError('file upload failed.')
            }
        },
    };

    const handleFont = async (data) => {
        const fontData = {
            name: data.originalFileName,
            path: data.fileUrl,
            size: data.fileSize,
        };

        try {
            const fontsResponse = await fetch(`${process.env.REACT_APP_API_URL}/fonts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fontData),
            });
            if (!fontsResponse.ok) {
                throw new Error('Failed to save font metadata.');
            }

            const fontsData = await fontsResponse.json();

            // Handle successful response
            message.success(`Font Add successfully.`);
            addFont(fontsData.data);

        } catch (error) {
            message.error(`Error: ${error.message}`);
            console.error('Error saving font metadata:', error);
        }
    };


    return (
        <div className="upload-box max-w-lg mx-auto my-6 p-6 border-dashed border-2 border-gray-400 text-center cursor-pointer">
            <Dragger {...props} className="bg-white hover:bg-gray-100">
                <p className="ant-upload-drag-icon">
                    <IoCloudUploadOutline className="text-gray-600" size={40}/>
                </p>
                <p className="text-lg font-semibold">Click or drag file to this area to upload</p>
                <p className="text-sm">Only .ttf files allowed</p>
            </Dragger>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default FontUpload;
