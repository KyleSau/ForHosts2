"use client";
import { FC } from "react";
import { Image } from "lucide-react";
import { FILE_CONSTS } from "@/lib/constants";

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
                    files: e.dataTransfer.files,
                },
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div
            id={""}
            className="relative mx-auto flex h-[300px] w-[325px] md:w-[365px] flex-col items-center justify-center border-2 border-dashed border-black py-5 text-center text-gray-400 hover:border-solid"
        >
            <input
                accept={[FILE_CONSTS.JPEG, FILE_CONSTS.PNG, FILE_CONSTS.BMP].join(",")}
                type="file"
                title=""
                multiple
                // className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
                className="absolute inset-0 m-0 h-auto w-auto cursor-pointer p-0 opacity-0 outline-none"
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
