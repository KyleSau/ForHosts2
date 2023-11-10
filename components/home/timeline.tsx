import React from 'react'

export default function Timeline() {
    return (
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
                <li className="mb-10 ml-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">May 2023</time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Forhosts.com Founded</h3>
                    <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">May 2023 we first conducted host interviews, conceptualized the Forhosts.com project, Purchased the name Forhosts.com, and development began.</p>
                    {/* <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">Learn more <svg className="w-3 h-3 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg></a> */}
                </li>
                <li className="mb-10 ml-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">November 2023</time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Private Testing Begins</h3>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">We begin testing the features, functionality, and improvements of our software with a few selected hosts in preparation for public launch</p>
                </li>
            </ol>
        </div>
    )
}
