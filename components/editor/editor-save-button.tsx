import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface EditorSaveButtonProps {
  dirty: boolean;
  submitted: boolean;
  isLoading: boolean;
}

export default function EditorSaveButton({
  dirty,
  submitted,
  isLoading,
}: EditorSaveButtonProps) {
  return (
    <div className="mt-4 flex p-2">
      <div className="flex flex-auto flex-row-reverse">
        {submitted ? (
          <button
            type="submit"
            className="duration-400 transform rounded-md bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-transform ease-in-out hover:scale-110 hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
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
            className={`duration-400 transform rounded-md transition-transform ease-in-out ${
              dirty ? "hover:scale-110" : "hover:scale-100"
            } px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isLoading
                ? "bg-blue-300 hover:bg-blue-300"
                : dirty
                ? "bg-indigo-600"
                : "bg-gray-300"
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
