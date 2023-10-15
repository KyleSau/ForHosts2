import { humanReadableFileSize } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

interface ImageItemProps {
    blobData: any;
    index: number;
    isUploading: boolean;
    onDelete: any;
}

export const ImageItem = ({ blobData, index, isUploading, onDelete }: ImageItemProps) => {
    const renderActionButton = () => {
        if (isUploading && !blobData.inBlobStore) {
            return (
                <button type="button" className="z-10">
                    <Loader2 className="animate-spin" />
                </button>
            );
        }
        return (
            <button type="button" className="..." onClick={() => onDelete(index)}>
                <Trash2 className="hover:stroke-rose-600" />
            </button>
        );
    };

    return (
        <div className="...">
            {renderActionButton()}
            <Image height="400" width="400" src={blobData.inBlobStore ? blobData.url : blobData.localBlobUrl} alt={""} />
            <div className="...">
                <span>{blobData.inBlobStore ? 'UPLOADED' : 'NOT UPLOADED'}</span>
                <span>{humanReadableFileSize(blobData.size)}</span>
            </div>
        </div>
    );
};