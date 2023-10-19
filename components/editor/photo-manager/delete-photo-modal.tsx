import { useModal } from "@/components/modal/provider";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { deleteAndReindex } from "@/lib/blob_actions";
import { checkIsOnDemandRevalidate } from "next/dist/server/api-utils";

interface DeleteImageModalProps {
    imageId: string;
    index: number;
    onDelete: (index: number) => void;
}

export default function DeletePhotoModal({ imageId, index, onDelete }: DeleteImageModalProps) {
    const modal = useModal();
    const [pending, setPending] = useState(false);

    async function handleDelete() {
        setPending(true);
        const res = await deleteAndReindex(imageId, index);

        setPending(false);

        if (!res) {
        } else {
            onDelete(index);
            modal?.hide();
        }
    }

    return (
        <div className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700">
            <div className="relative flex flex-col space-y-4 p-5 md:p-10">
                <h2 className="font-cal text-2xl dark:text-white">Delete Image</h2>
                <p>Are you sure you want to delete this image? This action cannot be undone.</p>
            </div>
            <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
                <DeleteImageButton onClick={handleDelete} pending={pending} />
            </div>
        </div>
    );
}

interface DeleteImageButtonProps {
    onClick: () => void;
    pending: boolean;
}

function DeleteImageButton({ onClick, pending }: DeleteImageButtonProps) {
    return (
        <button
            onClick={onClick}
            className=""
            disabled={pending}
        >
            {pending ? <Loader2 className="animate-spin" /> : <p>Delete</p>}
        </button>
    );
}
