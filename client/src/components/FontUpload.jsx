import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { IoCloudUploadOutline } from "react-icons/io5";
import { useFonts } from '../hooks/useFonts';

const { Dragger } = Upload;

const FontUpload = () => {
    const {handleAddFont} = useFonts();
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
                    handleAddFont(response.data)
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

    return (
        <div className='flex justify-center'>
            <div className='p-2 w-full lg:w-8/12'>
                <div className="upload-box w-full mx-auto rounded-sm border-dashed border-2 border-gray-400 text-center cursor-pointer">
                    <Dragger {...props} className="bg-white hover:bg-gray-100">
                        <p className="ant-upload-drag-icon flex justify-center">
                            <IoCloudUploadOutline className="text-gray-600" size={40}/>
                        </p>
                        <p className="text-lg font-semibold">Click or drag file to this area to upload</p>
                        <p className="text-sm">Only .ttf files allowed</p>
                    </Dragger>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            </div>
        </div>
        
    );
};

export default FontUpload;
