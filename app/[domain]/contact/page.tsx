import { notFound } from "next/navigation";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";

export default async function contact({
    params,
}: {
    params: { domain: string };
}) {
    const [data, posts] = await Promise.all([
        getSiteData(params.domain),
        getPostsForSite(params.domain),
    ]);

    if (!data) {
        notFound();
    }

    return (
        <>
            <div className="mb-20 w-full">
                test
            </div>

            <div className="mx-auto w-full max-w-screen-xl md:mb-28 lg:w-5/6">
                blank
            </div>
        </>
    );
}
