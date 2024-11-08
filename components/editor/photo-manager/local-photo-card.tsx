import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { LocalPhoto } from "./local-photo";

interface LocalPhotoCardProps {
  photo: LocalPhoto;
  className?: string; // Add this line to accept a className prop
}

export default function LocalPhotoCard({
  photo,
  className,
}: LocalPhotoCardProps) {
  return (
    <div className={className} key={"non-draggable"}>
      <button type="button" className="absolute left-2 top-2 z-10">
        <Loader2 className="animate-spin" />
      </button>
      <BlurImage
        alt={photo.url ?? ""}
        blurDataURL={placeholderBlurhash}
        className=" object-fit  h-[300px] w-full pb-1 grayscale filter"
        width={200}
        height={200}
        src={photo.url ?? "/placeholder.png"}
      />
    </div>
  );
}
