import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function EditorSaveButton({ dirty, submitted, isLoading, onSubmittedChange }) {
  
  return (
    <div className="flex p-2 mt-4">
      <div className="flex-auto flex flex-row-reverse">
        {submitted ? (
          <button
            type="submit"
            className="rounded-md bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-transform transform hover:scale-110 duration-400 ease-in-out"
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
            className={`rounded-md transition-transform transform duration-400 ease-in-out ${
              dirty ? 'hover:scale-110' : 'hover:scale-100'
            } px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isLoading ? 'bg-blue-300 hover:bg-blue-300' : dirty ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            onClick={() => {
              // Call the resetForm function passed from the parent component
              // resetForm();
            }}
          >
            {isLoading ? <div>Saving...</div> : <div>Save</div>}
          </button>
        )}
      </div>
    </div>
  );
}
