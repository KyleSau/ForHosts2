import BlogComponent from "./BlogComponent";

export default async function BlogPage() {

    const blogs = await prisma?.blog.findMany();

    return (<BlogComponent blogs={blogs} />)
}