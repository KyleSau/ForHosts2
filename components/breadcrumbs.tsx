"use client"
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TBreadcrumbProps = {
    homeElement: string;
    separator: string;
    containerClasses?: string;
    listClasses?: string;
    activeClasses?: string;
    capitalizeLinks?: boolean;
};

const Breadcrumbs = ({
    homeElement = "Dashboard",
    containerClasses,
    listClasses,
    activeClasses,
    capitalizeLinks,
}: TBreadcrumbProps) => {
    const paths = usePathname();
    const pathNames = paths.split('/').filter((path) => path);

    return (
        <nav className={`flex items-center px-5 py-3 text-gray-700 border-t border-r border-b border-stone-200 bg-stone-100 dark:bg-gray-800 dark:border-gray-700 ${containerClasses}`} aria-label="Breadcrumb">
            <ul className={`flex-shrink-0 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse ${listClasses}`}>
                <li className={`inline-flex items-center text-sm font-medium ${listClasses}`}>
                    <Link href={'/'}>
                        <div className="flex items-center">
                            <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            <span className={`text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white ${activeClasses}`}>
                                {homeElement}
                            </span>
                        </div>
                    </Link>
                </li>
                {pathNames.length > 0 && <li><svg className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                </svg></li>}
                {pathNames.map((link, index) => {
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`;
                    const itemClasses =
                        paths === href ? `${listClasses} ${activeClasses}` : listClasses;
                    // Capitalize the first letter of each breadcrumb
                    const itemLink = capitalizeLinks
                        ? link.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                        : link;

                    return (
                        <React.Fragment key={index}>
                            <li className={itemClasses}>
                                <Link href={href} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    {itemLink}
                                </Link>
                            </li>
                            {pathNames.length !== index + 1 && (
                                <li>
                                    <svg className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                </li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
