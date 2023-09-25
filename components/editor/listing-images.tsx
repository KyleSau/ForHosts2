"use client"
import Form from "@/components/form";
import { updatePostMetadata } from "@/lib/actions";
import { FileClickDragDrop } from "./file-drag-drop";

export default function ListingImages({ data }) {

    return (
        <div>
            <FileClickDragDrop componentId={'post-image-uploader'} data={data} />

        </div>
    )
}