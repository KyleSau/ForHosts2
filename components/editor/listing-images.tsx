"use client"
import Form from "@/components/form";
import { updatePostMetadata } from "@/lib/actions";
import { FileClickDragDrop } from "./file-drag-drop";
import EditorWrapper from "./editor-container-wrapper";

export default function ListingImages({ data }) {

    return (
        <EditorWrapper >
            <div>
                <FileClickDragDrop componentId={'post-image-uploader'} data={data} />
            </div>
        </EditorWrapper>
    )
}