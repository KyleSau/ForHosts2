import React from 'react'

export default function EditorSaveButton() {
  return (
    <div className="flex p-2 mt-4">

    <div className="flex-auto flex flex-row-reverse">
      <button
        type="submit" // Specify the button type as "submit" to trigger form submission
        className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Save
      </button>
    
    </div>
    </div>
  )
}
