import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function EditorSaveButton({ dirty, submitted, isLoading }) {
  return (
    <div className="flex p-2 mt-4">
      <div className="flex-auto flex flex-row-reverse">
        {submitted ? (
          <button
            type="submit"
            className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <div className="flex items-center">
              <div>Saved</div>
              <FontAwesomeIcon icon={faCheck} className="ml-2" />
            </div>
          </button>
        ) : (
          <button
            disabled={!dirty}
            type="submit"
            className={`rounded-md ${dirty ? 'hover:scale-110' : 'hover:scale-100'} duration-50 ease-in-out transition px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isLoading ? 'bg-blue-300 hover:bg-blue-300' : (dirty ? 'bg-indigo-600' : 'bg-gray-300')}`}

          >

            {isLoading ? (
              <div>Saving...</div>
            ) : (
              <div>Save</div>
            )}
          </button>
        )}
      </div>
    </div >
  );
}
