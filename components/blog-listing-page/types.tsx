import { Blog } from "@prisma/client";

export interface BlogCardProps {
  blog: Blog;
  isVisible?: boolean;
}
