import { useModal } from "../modal/provider";
import { ReactNode } from "react";

export default function CreateCalendarButton({
    children,
}: {
    children: ReactNode;
}) {
    const modal = useModal();
    return (
        <button
            onClick={() => modal?.show(children)}
            className="relative top-0 left-0 px-4 hover:bg-gray-600 bg-black text-white rounded-md py-2"
        >
            Add a calendar
        </button>
    );
}