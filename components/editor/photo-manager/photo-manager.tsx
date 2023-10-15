"use client"
// Import required dependencies and components
import React, { useState, useEffect } from 'react';
import {
  FILE_CONSTS,
  IMAGE_UPLOAD_QUANTITY_LIMIT,
  IMAGE_SIZE_LIMIT_BYTES,
} from '@/lib/constants';
import EditorWarningModal, {
  EditorWarningModalDataType,
  EditorWarningModalDataTemplate,
} from '@/components/editor/warning-confirmation-modal';
import {
  getBlobMetadata,
  deleteBlobMetadata,
  deleteBlobFromStore,
  uploadBlobMetadata,
  deleteBlob as deleteBlobAndMetadata,
  listAllBlobMetadata,
  listAllBlobsInStore,
} from '@/lib/blob_actions';
import { Image as ImagePrismaSchema, Post } from '@prisma/client';
import BlobUploader from './blob-uploader';
import { ImageItem } from './image-item';
import { BlobResult, put } from '@vercel/blob';

// Updated BlobData Interface
interface BlobData extends Partial<ImagePrismaSchema> {
  file?: File | null;
  localBlobUrl?: string;
  inBlobStore: boolean;
  isUploading?: boolean;
}

export const PhotoManager = ({ postData }) => {
  const postId = postData.id;
  const siteId = postData.site.id;

  // test states
  const [blobsFromStoreTest, setBlobsFromStoreTest] = useState<BlobResult[]>([]);
  const [blobMetadataTest, setBlobMetadataTest] = useState<ImagePrismaSchema[]>([]);

  const [blobDataArray, setBlobDataArray] = useState<BlobData[]>([]);
  const [editorWarningModalOpen, setEditorWarningModalOpen] = useState(false);
  const [editorWarningModalData, setEditorWarningModalData] = useState<EditorWarningModalDataType>(
    EditorWarningModalDataTemplate
  );

  useEffect(() => {
    const fetchExistingBlobs = async () => {
      const currentBlobMetadataForPost = await getBlobMetadata(siteId, postId);
      const currentImageDataArray = currentBlobMetadataForPost.map(
        (blobMetadata: ImagePrismaSchema & { post: Post | null }) => {
          const blobData: BlobData = {
            inBlobStore: true,
            ...blobMetadata,
          };
          return blobData;
        }
      );
      setBlobDataArray([...currentImageDataArray]);
    };
    fetchExistingBlobs();
  }, [postId, siteId]);


  const handleFileDeletion = async (index: number) => {
    const imageDataToDelete = blobDataArray[index];
    if (imageDataToDelete.inBlobStore && imageDataToDelete.id) {
      try {
        await deleteBlobAndMetadata(imageDataToDelete.id);
      } catch (error) {
        console.error('Error deleting blob and metadata:', error);
        return;
      }
    }

    const updatedImageDataArray = blobDataArray.filter((_, idx) => idx !== index);
    setBlobDataArray(updatedImageDataArray);
  };


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const PERMITTED_TYPES = [FILE_CONSTS.FILE, FILE_CONSTS.JPEG, FILE_CONSTS.PNG];

    const newFiles = Array.from(event.target.files ?? [])
      .filter(file => PERMITTED_TYPES.includes(file.type));

    const initialBlobDataArray = newFiles.map((file, index) => {
      const localBlobUrl = URL.createObjectURL(file);
      return {
        file,
        localBlobUrl,
        inBlobStore: false,
        orderIndex: blobDataArray.length + index,
        isUploading: true,
      };
    });

    // Immediately update the state to display all selected images with spinners
    setBlobDataArray(prevArray => [...prevArray, ...initialBlobDataArray]);

    // Define an async function to handle the upload of a single file
    const uploadSingleFile = async (blobData: BlobData, arrayIndex: number) => {
      // try {
      const blobResult = await put(blobData.file.name, blobData.file, {
        access: 'public',
        handleBlobUploadUrl: '/api/upload'
      });

      const updatedMetadata = await uploadBlobMetadata(blobResult, arrayIndex, postId, siteId);

      // Update the state for this specific blob data
      setBlobDataArray(prevArray => {
        const updatedBlobData = {
          ...blobData,
          ...updatedMetadata,
          inBlobStore: true,
          url: blobResult.url,
          isUploading: false,
        };
        const newArray = [...prevArray];
        newArray[arrayIndex] = updatedBlobData;
        return newArray;
      });

      // } catch (error) {
      //   console.error('Error uploading file:', error);

      //   setBlobDataArray(prevArray => {
      //     const updatedBlobData = {
      //       ...blobData,
      //       isUploading: false,
      //     };
      //     const newArray = [...prevArray];
      //     newArray[arrayIndex] = updatedBlobData;
      //     return newArray;
      //   });
      // }
    };

    initialBlobDataArray.forEach((blobData, index) => {
      const arrayIndex = blobDataArray.length + index;
      uploadSingleFile(blobData, arrayIndex);
    });
  };

  //TEST
  const handleListAllblobsInStore = async () => {
    console.log("[TEST] handleListAllblobsInStore called");
    const blobsInStore = await listAllBlobsInStore();
    console.log("listCurrentBlobsInStore: blobsInStore: ", blobsInStore);
    setBlobsFromStoreTest(blobsInStore);
  };

  //TEST
  const handlePurgeAllBlobsInStore = async () => {
    console.log("[TEST] handlePurgeAllBlobsInStore called");
    blobsFromStoreTest.forEach((br: BlobResult) => {
      if (br.url) {
        const url = br.url;
        const response = deleteBlobFromStore(url);
        response.then((responseJson: any) => {
          console.log("handlePurgeAllBlobsInStore responseJson: ", responseJson);
        });
      }
    });
  };

  //TEST
  const printOutData = async () => {
    console.log("[TEST] printOutData called");
    console.log("fileDataObjects: ", JSON.stringify(blobDataArray));
  }

  //TEST
  const handleListBlobMetadata = async () => {
    console.log("[TEST] handleListBlobMetadata called");
    const allBlobMetadata = await listAllBlobMetadata();
    console.log("allBlobMetadata: ", allBlobMetadata);
    setBlobMetadataTest([...allBlobMetadata]);
  };

  //TEST
  const handlePurgeAllBlobMetadata = async () => {
    console.log("[TEST] handlePurgeAllBlobMetadata entered");
    blobMetadataTest.forEach((imgObj: ImagePrismaSchema) => {
      const response = deleteBlobMetadata(imgObj.id);
      // console.log("response: ", response);
      response.then((value: ImagePrismaSchema) => {
        // console.log("value deleted: ", value);
      });
    })
  };


  return (
    <>
      <div>
        <p>
          &nbsp;
          <button type="submit" className='border border-black' onClick={printOutData}>Print Local Data to Console</button>
        </p>
        <p>
          <button type="submit" className='border border-black' onClick={handleListBlobMetadata}>List All Blob Metadata</button>
          <button type="submit" className='border border-black' onClick={handlePurgeAllBlobMetadata}>Purge All Blob Metadata</button>
          &nbsp;
          <button type="submit" className='border border-black' onClick={handleListAllblobsInStore}>List All Blobs In Store</button>
          <button type="submit" className='border border-black' onClick={handlePurgeAllBlobsInStore}>Purge All Blobs In Store</button>
        </p>
      </div>
      {/* <BlobUploader onFileUpload={handleFileUpload} />
      <div className="grid grid-cols-3">
        {blobDataArray.map((blobData, index) => (
          <ImageItem
            key={index}
            blobData={blobData}
            index={index}
            isUploading={blobData.isUploading || false}
            onDelete={handleFileDeletion}
          />
        ))}
      </div>
      <EditorWarningModal
        modalOpen={editorWarningModalOpen}
        setModalOpen={setEditorWarningModalOpen}
        modalData={editorWarningModalData} handleDeletePressed={handleFileDeletion} /> */}
    </>
  );
};


