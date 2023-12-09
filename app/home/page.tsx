import Hero from "@/components/home/hero";
import HomeLayout from "@/components/home/home-layout";
import LandingInfo from "@/components/home/landing-info";
import { PropertyQuantitySelection } from "@/components/home/property-quantity-selection";
import UnderDevelopment from "./under-development-page";

export default function Home() {
  const services = [
    { imageUrl: "https://example.com/image1.jpg", description: "Service 1" },
    { imageUrl: "https://example.com/image2.jpg", description: "Service 2" },
    { imageUrl: "https://example.com/image3.jpg", description: "Service 3" },
  ];
  return (
    <div>
      <HomeLayout>
        <UnderDevelopment />
      </HomeLayout>
    </div>
  );
}
