"use client";
import React, { useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import PhotoUploader from "./photo-uploader";
import { Image } from "@prisma/client";

import {
  FILE_CONSTS,
  IMAGE_UPLOAD_QUANTITY_LIMIT,
  IMAGE_SIZE_LIMIT_MB,
  IMAGE_SIZE_LIMIT_BYTES,
} from "@/lib/constants";
import PhotoCard from "./photo-card";
import { put } from "@vercel/blob";
import { shiftBlobMetadata, createImageMetadata } from "@/lib/blob_actions";
import LocalPhotoCard from "./local-photo-card";
import { LocalPhoto } from "./local-photo";
import EditorWrapper from "../editor-wrapper";
import EditorTitle from "../editor-components-title";
import { humanReadableFileSize } from "@/lib/utils";
import { stepConnectorClasses } from "@mui/material";
import { toast } from "sonner";

const PERMITTED_TYPES = new Set([
  FILE_CONSTS.BMP,
  FILE_CONSTS.JPEG,
  FILE_CONSTS.PNG,
]);

interface PhotoMangerProps {
  images: Image[];
  postId: string;
  siteId: string;
}

interface OversizedFileData {
  fileName: string,
  fileSize: number
}

export default function PhotoManager({
  images,
  postId,
  siteId,
}: PhotoMangerProps) {
  const [photos, setPhotos] = useState<Image[]>(images);
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);

  const handleDelete = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const onPhotoDragEnd = async (event: Sortable.SortableEvent) => {
    const { oldIndex, newIndex } = event;
    if (oldIndex === undefined || newIndex === undefined) return;
    shiftBlobMetadata(postId, oldIndex, newIndex);
  };

  const movePhoto = (oldIndex: number, newIndex: number) => {
    setPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos];
      const [movedPhoto] = updatedPhotos.splice(oldIndex, 1);
      updatedPhotos.splice(newIndex, 0, movedPhoto);
      return updatedPhotos;
    });
  };

  const onPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const localFiles = Array.from(files ?? []).filter((file) => PERMITTED_TYPES.has(file.type));

    if (
      photos.length > IMAGE_UPLOAD_QUANTITY_LIMIT ||
      photos.length + localFiles.length > IMAGE_UPLOAD_QUANTITY_LIMIT
    ) {
      alert(
        `Only ${IMAGE_UPLOAD_QUANTITY_LIMIT} images may be uploaded for this listing`,
      );
      return;
    }

    setLocalPhotos((prevLocalPhotos) => [
      ...prevLocalPhotos,
      ...localFiles.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    ]);

    uploadPhotos(localFiles);
  };

  const uploadPhotos = async (localFiles: File[]) => {
    let oversizedFileNames: Array<OversizedFileData> = [];

    for (let i = 0; i < localFiles.length; i++) {
      // Use a traditional for loop to process files one by one
      const file = localFiles[i];

      if (file.size > IMAGE_SIZE_LIMIT_BYTES) {
        oversizedFileNames.push({ fileName: file.name, fileSize: file.size });
        continue;
      }

      try {
        const blobResult = await put(file.name, file, {
          access: "public",
          handleBlobUploadUrl: "/api/upload_blob",
        });

        if (!blobResult) toast.error("Error uploading file");

        const photo = await createImageMetadata(blobResult, postId, siteId);

        if (photo) {
          setPhotos((prevPhotos) => [...prevPhotos, photo]);

          // Remove the corresponding localPhoto
          setLocalPhotos((prevLocalPhotos) =>
            prevLocalPhotos.filter((localPhoto) => localPhoto.name !== file.name),
          );
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setLocalPhotos((prevLocalPhotos) =>
          prevLocalPhotos.filter((localPhoto) => localPhoto.name !== file.name),
        );
      }
    }

    // Remove all oversized files from localPhotos at once
    if (oversizedFileNames.length > 0) {
      const overSizedFileNameSet = new Set();

      let formattedNames: string = oversizedFileNames
        .map((oversizedFileData: OversizedFileData) => {
          overSizedFileNameSet.add(oversizedFileData.fileName);
          return oversizedFileData.fileName + `  (${humanReadableFileSize(oversizedFileData.fileSize)})`;
        })
        .join("\n");

      alert(
        `The following ${oversizedFileNames.length > 1 ? "files were" : "file was"
        } not uploaded because ${oversizedFileNames.length > 1 ? "they exceed" : "it exceeds"
        } the file size limit of ${IMAGE_SIZE_LIMIT_MB
        } MB.\n\n${formattedNames}`,
      );

      setLocalPhotos((prevLocalPhotos) =>
        prevLocalPhotos.filter(
          (localPhoto) => !overSizedFileNameSet.has(localPhoto.name),
        ),
      );
    }
  };

  return (
    <EditorWrapper>
      <EditorTitle
        title="Photo Manager"
        desc={
          photos.length == 0
            ? "Manage your listing's photos"
            : `You may add ${IMAGE_UPLOAD_QUANTITY_LIMIT - photos.length
            } more photos`
        }
      />
      <div className="flex justify-center">
        <ReactSortable
          className="grid grid-cols-1 gap-2 transition-all  duration-500 ease-in editorlg:grid-cols-2 2xl:grid-cols-3"
          list={photos}
          setList={setPhotos}
          onEnd={onPhotoDragEnd}
          filter=".non-draggable"
          preventOnFilter={false}
        >
          {photos.map((photo: Image, index: number) => (
            <PhotoCard
              handleDelete={handleDelete}
              movePhoto={movePhoto}
              postId={postId}
              key={photo.id}
              index={index}
              photo={photo}
              totalImages={photos.length}
            />
          ))}

          {localPhotos.map((photo: LocalPhoto, photoIdx: number) => (
            <LocalPhotoCard
              key={photoIdx}
              photo={photo}
              className="non-draggable relative mx-auto w-[325px] md:w-[365px]"
            />
          ))}

          <PhotoUploader onFileUpload={onPhotoUpload} />
        </ReactSortable>
      </div>
    </EditorWrapper>
  );
}
