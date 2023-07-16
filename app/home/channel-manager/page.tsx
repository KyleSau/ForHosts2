import HomeLayout from "@/components/home/home-layout";
import Navbar from "@/components/home/nav-bar";
import PriceCards from "@/components/home/pricing-card";
import Meta from "@/components/meta";
import { Section } from "@/components/home/Section";

export default function channelmanager() {
    return (
        <HomeLayout>
            <Section  >
                <div className="container mx-auto px-8 py-4">
                    <h1 className="flex justify-center text-lg font-bold">ForHosts Channel Manager</h1>
                    <div className="max-w-3xl mx-auto mt-8">
                        test
                        <p className="text-lg text-center text-gray-700  ">test</p>
                    </div>
                </div>
                <hr className="border-t-2 border-black my-8" />
                <h1 className="flex justify-center text-lg font-bold">lorem</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    test
                </div>
            </Section>
        </HomeLayout>
    );
}
