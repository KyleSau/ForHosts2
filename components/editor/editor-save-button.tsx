import React from 'react';

// Assuming you are using Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function EditorSaveButton({ submitted }) {
  return (
    <div className="flex p-2 mt-4">
      <div className="flex-auto flex flex-row-reverse">
        {submitted ? (
          <button
            type="submit"
            className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" /> Saved
          </button>
        ) : (
          <button
            type="submit"
            className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
