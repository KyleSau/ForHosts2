"use client";
import { useRouter } from "next/navigation";
import { useModal } from "../modal/provider";
import CreateCalendarButton from "./create-calendar-button";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import LoadingDots from "../icons/loading-dots";
import clsx from "clsx";
import { createCalendar } from "@/lib/actions";
import { XCircle } from "lucide-react";

interface ImportCalendarModalProps {
    postId: string;
}

const handleCloseModal = () => {
    onClose();
};

export default function ImportCalendarModal({ postId, addCalendar }: any) {
    const router = useRouter();
    const modal = useModal();

    const [data, setData] = useState({
        name: "",
        url: "",
    });

    return (
        <form
            action={async (data: FormData) => {
                // TODO: Add logic to import calendar
            }}
            className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
        >
            <div className="relative flex flex-col space-y-4 p-5 md:p-10">
                <div
                    className="absolute top-4 right-4 cursor-pointer text-gray-500"
                    onClick={handleCloseModal}
                >
                    <XCircle size={24} color="black" />
                </div>
                <h2 className="font-cal text-2xl dark:text-white">Import Calendar</h2>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-stone-500 dark:text-stone-400"
                    >
                        Calendar Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        placeholder="My Calendar"
                        autoFocus
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        maxLength={32}
                        required
                        className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="url"
                        className="text-sm font-medium text-stone-500"
                    >
                        Calendar URL
                    </label>
                    <input
                        name="url"
                        type="url"
                        placeholder="https://example.com/my-calendar.ics"
                        value={data.url}
                        onChange={(e) => setData({ ...data, url: e.target.value })}
                        required
                        className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
                    />
                </div>
            </div>
            <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
                <ImportCalendarFormButton addCalendar={addCalendar} request={{ name: data.name, url: data.url, postId: postId }} />
            </div>
        </form>
    );
}

// interface ImportCalendarRequest {
//     postId: string;
//     url: string;
//     name: string;
// }

function ImportCalendarFormButton({ request, addCalendar }: any) {
    const { pending } = useFormStatus();
    const handleCreateCalendar = async (request) => {
        const newCalendar = await createCalendar(request);
        addCalendar(newCalendar);
    };
    return (
        <button
            className={clsx(
                "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
                pending
                    ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                    : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
            )}
            disabled={pending}
            // onClick={() => createCalendar(request)}
            onClick={() => handleCreateCalendar(request)}
        >
            {pending ? <LoadingDots color="#808080" /> : <p>Import</p>}
        </button>
    );
}
