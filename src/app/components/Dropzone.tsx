'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface DropzoneProps {
    onUpload: (url: string) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onUpload }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Validate file type and size
        const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Please upload a PNG, JPG, or GIF.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError('File is too large. Maximum size is 5MB.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const ipfsHash = response.data.ipfsHash;
            const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
            onUpload(url);
            setSuccess(`Image uploaded successfully!`);
        } catch (err) {
            setError('Failed to upload image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
            <input {...getInputProps()} />
            {loading ? (
                <p>Uploading...</p>
            ) : (
                <p>Drag & drop an image here, or click to select one</p>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
    );
};

export default Dropzone;
