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
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim."
      image="/feature.svg"
      imageAlt="First feature alt text"
    />
    <VerticalFeatureRow
      title="How do we help?"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim."
      image="/feature2.svg"
      imageAlt="Second feature alt text"
      reverse
    />
    <VerticalFeatureRow
      title="Your success is our success"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim."
      image="/feature3.svg"
      imageAlt="Third feature alt text"
    />
  </Section>
);

export { VerticalFeatures };