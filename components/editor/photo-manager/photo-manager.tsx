"use client";
import React, { useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import PhotoUploader from "./photo-uploader";
import { Image } from "@prisma/client";

import { FILE_CONSTS, IMAGE_UPLOAD_QUANTITY_LIMIT, 
  IMAGE_SIZE_LIMIT_MB, IMAGE_SIZE_LIMIT_BYTES } from "@/lib/constants";
import PhotoCard from './photo-card';
import { put } from '@vercel/blob';
import { shiftBlobMetadata, createImageMetadata } from '@/lib/blob_actions';
import LocalPhotoCard from './local-photo-card';
import { LocalPhoto } from './local-photo';
import EditorWrapper from "../editor-wrapper";
import EditorTitle from "../editor-components-title";

const PERMITTED_TYPES = new Set([FILE_CONSTS.FILE, FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);

interface PhotoMangerProps {
  images: Image[];
  postId: string;
  siteId: string;
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
    const localFiles = Array.from(files ?? []).filter((file) =>
      PERMITTED_TYPES.has(file.type),
    );

    if (
      photos.length > IMAGE_UPLOAD_QUANTITY_LIMIT ||
      photos.length + localFiles.length > IMAGE_UPLOAD_QUANTITY_LIMIT
    ) {
      alert(
        `Only ${IMAGE_UPLOAD_QUANTITY_LIMIT} images may be uploaded for this listing`,
      );
      return;
    }
    const onPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const localFiles = Array.from(files ?? []).filter(file => PERMITTED_TYPES.has(file.type));

        if (photos.length > IMAGE_UPLOAD_QUANTITY_LIMIT || photos.length + localFiles.length > IMAGE_UPLOAD_QUANTITY_LIMIT) {
            alert(`Only ${IMAGE_UPLOAD_QUANTITY_LIMIT} images may be uploaded for this listing`);
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
    let oversizedFileNames: string[] = [];

    for (let i = 0; i < localFiles.length; i++) {
      // Use a traditional for loop to process files one by one
      const file = localFiles[i];

      if (file.size > IMAGE_SIZE_LIMIT_BYTES) {
        oversizedFileNames.push(file.name);
        continue;
      }

      try {
        const blobResult = await put(file.name, file, {
          access: "public",
          handleBlobUploadUrl: "/api/upload",
        });

        const image = await createImageMetadata(blobResult, postId, siteId);

        if (image) {
          setPhotos((prevPhotos) => [...prevPhotos, image]);

          // Remove the corresponding localPhoto
          setLocalPhotos((prevLocalPhotos) =>
            prevLocalPhotos.filter(
              (localPhoto) => localPhoto.name !== file.name,
            ),
          );
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    // Remove all oversized files from localPhotos at once
    if (oversizedFileNames.length > 0) {
      alert(
        `${JSON.stringify(oversizedFileNames)} ${
          oversizedFileNames.length > 1 ? "were" : "was"
        } not uploaded because it exceeds the file size limit of ${IMAGE_SIZE_LIMIT_MB} MB.`,
      );
      setLocalPhotos((prevLocalPhotos) =>
        prevLocalPhotos.filter(
          (localPhoto) => !oversizedFileNames.includes(localPhoto.name),
        ),
      );
    }
  };

  const renderEditorTitleAndDescription = () => {
    return (<>
      { (photos.length) == 0? 
          <EditorTitle title="Photo Manager" desc="Manage your listing's photos" /> 
          :
          <EditorTitle title="Photo Manager" desc={`You may add ${IMAGE_UPLOAD_QUANTITY_LIMIT - photos.length} more photos`} />
      }
    </>);
  };

  return (
    <EditorWrapper>
      {renderEditorTitleAndDescription()}

      <ReactSortable
        className=" grid gap-2 transition-all duration-500 ease-in sm:grid-cols-1 lg:grid-cols-2 lg:gap-6 2xl:grid-cols-3"
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
            key={photo.orderIndex}
            index={index}
            photo={photo}
            totalImages={photos.length}
          />
        ))}

        {localPhotos.map((photo: LocalPhoto) => (
          <LocalPhotoCard
            key={photo.name}
            photo={photo}
            className="non-draggable relative mx-auto w-[325px] md:w-[365px]"
          />
        ))}

        <PhotoUploader onFileUpload={onPhotoUpload} />
      </ReactSortable>
    </EditorWrapper>
  );

}}
