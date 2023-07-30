
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Posts from "@/components/posts";
import PlacholderCard from "@/components/placeholder-card";

export default async function RentalsPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    return (
        <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
            <div className="flex flex-col space-y-6">
                <h1 className="font-cal text-3xl font-bold text:black">
                    Listings
                </h1>
                <Suspense
                    fallback={
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <PlacholderCard key={i} />
                            ))}
                        </div>
                    }
                >
                    <Posts limit={20} />
                </Suspense>
            </div>
        </div>
    );
}
