export interface Blog {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  image: {
    path: string;
    altText: string;
  };
  keywords: string[];
  openGraph?: {
    description: string;
    images: string[];
  };
}
