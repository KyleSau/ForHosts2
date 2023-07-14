import LandingPage from "@/components/home/Hero";
import HomeLayout from "@/components/home/home-layout";
import LandingInfo from "@/components/home/landing-info";
import { PropertyQuantitySelection } from "@/components/home/PropertyQuantitySelection";


export default function Home() {
  const services = [
    { imageUrl: "https://example.com/image1.jpg", description: "Service 1" },
    { imageUrl: "https://example.com/image2.jpg", description: "Service 2" },
    { imageUrl: "https://example.com/image3.jpg", description: "Service 3" },
  ];
  return (
    <div>
      <HomeLayout>
        <LandingPage />
        <LandingInfo header="Our Services" services={services} />
        <PropertyQuantitySelection />
      </HomeLayout>
    </div>
  );
}
