import React from 'react'

export default function EditorWrapper({ children }) {
  return (
    <div className=''>
      <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-sm">
        {children}
      </div>
    </div>
  )
}
