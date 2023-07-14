import HomeLayout from "@/components/home/home-layout";
import Navbar from "@/components/home/nav-bar";
import PriceCards from "@/components/home/PricingCard";
import Meta from "@/components/meta";
export default function Pricing() {
  return (
    <HomeLayout>
  <Meta title="ForHosts pricing for a dynamic website" description="Pricing packages for property hosts to make their own dynamic websites!" />
<PriceCards />
   </HomeLayout>
  );
}
