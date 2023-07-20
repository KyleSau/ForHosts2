import React from "react";
import { blogs } from "@/components/blogs/blog-data";
import { Blog } from "@/components/blogs/types";
import HomeLayout from "@/components/home/home-layout";
import Image from "next/image";
import BlogItem from "@/components/blogs/blog-item";
import { Section } from "@/components/home/Section";

interface BlogDetailProps {
  params: {
    slug: string;
  };
  randomBlogs: Blog[];
}

type Props = {
  params: {
    slug: string;
  };
  searchParams: any;
};

type ResolvingMetadata = Promise<Metadata> | Metadata;

type Metadata = {
  title: string;
  description: string;
  keywords: string;
  openGraph: {
    description: string;
    images: string[];
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { slug } = params;

  // fetch data from local array
  const blog = blogs.find((blog) => blog.slug === slug);

  if (blog) {
    // access and extend parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    // im assumin that the blog object has a `description` and `keywords` property
    return {
      title: blog.title,
      description: blog.description,
      keywords: blog.keywords.join(", "), // assuming keywords is an array of strings
      openGraph: {
        description: blog.description,
        images: [blog.image.path, ...previousImages],
      },
    };
  } else {
    throw new Error("Blog not found");
  }
}

// randomizing the blogs below the main blog component
function getRandomBlogs(n: number, currentBlogSlug: string) {
  const tempBlogs = blogs.filter((blog) => blog.slug !== currentBlogSlug);

  for (let i = tempBlogs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempBlogs[i], tempBlogs[j]] = [tempBlogs[j], tempBlogs[i]];
  }

  return tempBlogs.slice(0, n);
}

// main component the renders most of the pages contents
const BlogDetail: React.FC<BlogDetailProps> = ({ params }) => {
  const { slug } = params;

  const blog = blogs.find((blog: Blog) => blog.slug === slug);

  if (!blog) {
    return (
      <HomeLayout>
        <div className="flex justify-center pt-8">Blog not found</div>
      </HomeLayout>
    );
  }

  // Call the getRandomBlogs function with the number of blogs you want to display, idk if we wanna change the amount later
  //so i thought fk it and made a variable.
  const randomBlogs = getRandomBlogs(4, slug);

  // Create the BlogItem components for the random blogs
  const randomBlogItems = randomBlogs.map((blog) => (
    <BlogItem key={blog.slug} blog={blog} />
  ));

  return (
    <HomeLayout>
      <Section title={blog.title} description={blog.description}>
        <div className="container mx-auto px-8 py-4">
          <Image
            src={blog.image.path}
            alt={blog.image.altText}
            width={52}
            height={52}
            className="mx-auto h-auto w-full max-w-lg"
          />
          <div className="mx-auto mt-8 max-w-3xl">
            <p className="text-center text-lg text-gray-700">{blog.content}</p>
          </div>
        </div>
        <hr className="my-8 border-t-2 border-black" />
        <h1 className="flex justify-center text-lg font-bold">Read more...</h1>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {randomBlogItems}
        </div>
      </Section>
    </HomeLayout>
  );
};

export default BlogDetail;
