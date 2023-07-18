import { ReactNode } from "react";
import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";

export default async function InboxPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    return (
        <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
            <div className="flex flex-col space-y-6">
                <h1 className="font-cal text-3xl font-bold dark:text-white">
                    inbox
                </h1>
                This page is where hosts messaging inbox would be displayed.
            </div>
        </div>
    );
}
