import Hero from "@/components/home/hero";
import HomeLayout from "@/components/home/home-layout";
import LandingInfo from "@/components/home/landing-info";
import { PropertyQuantitySelection } from "@/components/home/property-quantity-selection";
import SubscribeForm from "@/components/home/subscribe-form";
import ThirdPartyLogos from "@/components/home/third-party-logos";
import Timeline from "@/components/home/timeline";


export default function Home() {
  const services = [
    { imageUrl: "https://example.com/image1.jpg", description: "Service 1" },
    { imageUrl: "https://example.com/image2.jpg", description: "Service 2" },
    { imageUrl: "https://example.com/image3.jpg", description: "Service 3" },
  ];
  return (
    <div>
      <HomeLayout>
        <Hero />
        <ThirdPartyLogos />
        <LandingInfo header="Our Services" services={services} />
        <Timeline />
        <SubscribeForm />
        <PropertyQuantitySelection />
      </HomeLayout>
    </div>
  );
}
