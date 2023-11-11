/**
 * v0 by Vercel.
 * @see https://v0.dev/t/fV7MNjaD82D
 */
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function BlogForm() {
    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 space-x-2">
                <svg
                    className=" text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <svg
                    className=" text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                    className=" text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M2 20h.01" />
                    <path d="M7 20v-4" />
                    <path d="M12 20v-8" />
                    <path d="M17 20V8" />
                    <path d="M22 4v16" />
                </svg>
                <svg
                    className=" text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
            </div>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Create a Blog Post</h2>
                <form className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input className="w-full mt-1" id="title" placeholder="Enter title" type="text" />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input className="w-full mt-1" id="description" placeholder="Enter description" type="text" />
                    </div>
                    <div>
                        <Label htmlFor="content">Content</Label>
                        <textarea className="w-full h-32 mt-1 p-2 border rounded-md" id="content" placeholder="Enter content" />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input className="w-full mt-1" id="slug" placeholder="Enter slug" type="text" />
                    </div>
                    <div>
                        <Label htmlFor="image">Image URL</Label>
                        <Input className="w-full mt-1" id="image" placeholder="Enter image URL" type="text" />
                    </div>
                    <div>
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input className="w-full mt-1" id="keywords" placeholder="Enter keywords separated by comma" type="text" />
                    </div>
                    <Button className="mt-4" type="submit" variant="default">
                        Submit Post
                    </Button>
                </form>
            </div>
        </div>
    )
}
