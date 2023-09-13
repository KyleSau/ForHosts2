"use client"
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useDebounce } from "use-debounce";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { useTransition } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { EditorBubbleMenu } from "./bubble-menu";
import { Post } from "@prisma/client";
import { updatePost, updatePostMetadata } from "@/lib/actions";
import clsx from "clsx";
import LoadingDots from "../icons/loading-dots";
import { ExternalLink, Info } from "lucide-react";
import DateSlider from "../booking/date-slider";
import { Tooltip } from "@mui/material";
import { FileClickDragDrop } from "./file-drag-drop";


type PostWithSite = Post & { site: { subdomain: string | null } | null };
let [isPendingSaving, startTransitionSaving] = useTransition();
let [isPendingPublishing, startTransitionPublishing] = useTransition();

const [data, setData] = useState<PostWithSite>(post);
const [hydrated, setHydrated] = useState(false);
const [showCheckTimes, setShowCheckTimes] = useState(true);
const [showPropertyDetails, setShowPropertyDetails] = useState(false);
const [showAddPhotoArea, setShowAddPhotoArea] = useState(true);

const sliderIntervals = ["1 mo", "2 mo", "3 mo", "4 mo", "5 mo", "6 mo", "1 yr", "custom"];
const [sliderIdx, setSliderIdx] = useState(0);

const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`;

const [debouncedData] = useDebounce(data, 1000);

export default function PostEditor({ post }: { post: PostWithSite }) {
    const [formData, setFormData] = useState(post);

    useEffect(() => {
        // Handle form data changes and updates to the backend
    }, [formData]);

    return (
        <div className="max-w-screen-lg mx-auto p-8 border rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Edit Your Listing</h1>

            {/* Title and Description */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Title of Property"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-6">
                <textarea
                    placeholder="Description of Property"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Pricing and Details */}
            <div className="mb-6">
                <input
                    type="number"
                    placeholder="Price per night at property"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-6">
                <input
                    type="number"
                    placeholder="Maximum number of guests allowed for stay"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-6">
                <input
                    type="number"
                    placeholder="Minimum stay required at property (days)"
                    value={formData.minimumStay}
                    onChange={(e) => setFormData({ ...formData, minimumStay: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Availability */}
            <div className="mb-6">
                <label className="block mb-2">Availability Window</label>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={formData.availabilityStartDate}
                        onChange={(e) => setFormData({ ...formData, availabilityStartDate: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={formData.availabilityEndDate}
                        onChange={(e) => setFormData({ ...formData, availabilityEndDate: e.target.value })}
                        className="p-2 border rounded"
                    />
                </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
                <label className="block mb-2">Amenities</label>
                <input
                    type="text"
                    placeholder="Amenities (comma separated)"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Other Details */}
            <div className="mb-6">
                <label className="block mb-2">Other Details</label>
                {/* Add more fields as needed */}
                <input
                    type="text"
                    placeholder="Property Details"
                    value={formData.propertyDetails}
                    onChange={(e) => setFormData({ ...formData, propertyDetails: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={() => {
                    // Handle form submission
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Save Changes
            </button>
        </div>
    );
}
