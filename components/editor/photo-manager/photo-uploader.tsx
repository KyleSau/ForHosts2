"use client"
import { FC } from "react";
import { Image } from 'lucide-react'

interface UploaderProps {
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUploader: FC<UploaderProps> = ({ onFileUpload }) => {

    const handleDragOver = (e: React.DragEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            onFileUpload({
                target: {
                    files: e.dataTransfer.files
                }
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div
            id={""}
            className="relative flex flex-col justify-center items-center text-center py-5 text-gray-400 border-dashed border-2 hover:border-solid border-black"
        >
            <input accept="image/png, image/jpeg" type="file" title="" multiple
                className="absolute inset-0 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onChange={onFileUpload}
            />
            <Image id="drag-drop-image-icon" />
            <p className="m-0">Drag your files here or click in this area.</p>
        </div>
    );
};

export default PhotoUploader;