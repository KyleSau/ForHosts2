"use client"
import { FC } from "react";

interface UploaderProps {
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUploader: FC<UploaderProps> = ({ onFileUpload }) => {
    return (
        <div className="uploader" key="photo-uploader">
            <input
                type="file"
                multiple
                accept="image/png, image/jpeg"
                onChange={onFileUpload}
                className="file-input"
            />
            <label htmlFor="file-input" className="file-label">
                Click or drag files here to upload
            </label>
        </div>
    );
};

export default PhotoUploader;