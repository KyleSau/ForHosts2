import { VerticalFeatureRow } from "./vertical-feature-row";
import { Section } from "./Section"
const VerticalFeatures = () => (
  <Section
    title="What We Do"
    description="ForHosts enables you to offer direct booking to your guests, without the hassle of managing a website. We take care of the technical stuff, so you can focus on what matters most. 
      "
  >
    <VerticalFeatureRow
      title="Why us?"
      description="We offer the simplest way to launch your own direct booking website with lightning fast hosting, Quick and easy setup, and a beautiful website that you can customize to your liking."
      image="/searching.svg"
      imageAlt="First feature alt text"
    />
    <VerticalFeatureRow
      title="How do we help?"
      description="A direct booking website puts you in complete control of your short term rental business. You set your own rules, and you don't have to pay any commissions."
      image="/growth.svg"
      imageAlt="Second feature alt text"
      reverse
    />
    <VerticalFeatureRow
      title="Your success is our success"
      description="We strive for host success. We are constantly adding new features to help you grow your business. We are always here to help you with any questions you may have.
      ForHosts is a small business, and we are always looking for ways to improve. If you have any suggestions, please let us know!"
      image="/growthfrontpage.svg"
      imageAlt="Third feature alt text"
    />
  </Section>
);

export { VerticalFeatures };