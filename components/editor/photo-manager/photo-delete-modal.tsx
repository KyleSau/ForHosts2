import React from "react";

export default function PhotoDeleteModal({
  toggleModal,
  closeImage,
  deleteImage,
}) {
  return (
    <div className="max-h-[60vh] overflow-y-auto rounded-lg bg-white p-6 shadow-md md:p-8">
      <button
        className="absolute right-4 top-4 text-2xl"
        onClick={() => toggleModal(null)}
      >
        &times;
      </button>
      <h2 className="mb-4 text-lg font-semibold">Delete Image</h2>
      <div className="mb-4">
        <p className="text-base text-gray-600">
          Are you sure you want to delete this image?
        </p>
      </div>
      <div className="flex justify-between">
        <button
          className="rounded border border-black bg-orange-100 px-4 py-2 text-black hover:bg-black hover:text-white"
          onClick={() => {
            // Handle delete image logic here
            closeImage();
          }}
        >
          Cancel
        </button>
        <button
          className="rounded border border-black bg-red-400 px-4 py-2 text-black  hover:bg-black hover:text-white"
          onClick={() => {
            // Handle delete image logic here
            deleteImage();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
