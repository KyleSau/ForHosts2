"use client"
import React, { useRef, useState } from 'react';
import {
    RotateCw,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Lock,
    Info
} from "lucide-react";
import RegExURL from './regex-url';
import Logo from '../Logo';


export default function PreviewSite({ url }) {
    const iframeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const urlTextRef = useRef(null);

    const handleBack = () => {
        iframeRef.current.contentWindow.history.back();
    };

    const handleRefresh = () => {
        setIsLoading(true); // Show loading message and spinner again
        iframeRef.current.src = url;
    };

    const handleLoad = () => {
        setIsLoading(false); // Hide loading message and spinner when iframe has loaded
    };

    const handleLoadStart = () => {
        setIsLoading(true); // Show loading message and spinner when iframe starts loading
    };

    const handleUrlClick = () => {
        if (urlTextRef.current) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(urlTextRef.current);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    return (
        <div className='flex justify-center pt-14'>
            <div className="md:w-full md:h-screen border border-black w-[300px] h-[500px] relative"> {/* Add relative class */}
                <div className='bg-zinc-700 flex items-center'>
                    <button
                        disabled={true}
                        onClick={handleBack}
                        className="ml-2 p-2 rounded-full flex justify-center items-center w-10 h-10 text-white"
                    >
                        <ArrowLeft width={25} height={25} color="gray" />
                    </button>
                    <button
                        disabled={true}
                        className="ml-2 p-2 rounded-full flex justify-center items-center w-10 h-10 text-white"
                    >
                        <ArrowRight width={25} height={25} color="gray" />
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="ml-2 p-2 rounded-full flex justify-center items-center w-9 h-9 text-white hover:bg-zinc-500 transition-colors duration-200 ease-in-out"
                    >
                        <RotateCw color="white" />
                    </button>
                    <div
                        ref={urlTextRef}
                        className='overflow-hidden rounded-l-3xl w-full bg-zinc-800 text-white pl-2 pr-2 ml-2 my-2 p-2 cursor-text flex items-center'
                        onClick={handleUrlClick}
                    >
                        {
                            url.startsWith('https://') ?
                                <Lock className='mx-2' width={16} height={16} color="lightgray" /> :
                                <Info className='mx-2' width={16} height={16} color="lightgray" />
                        }
                        <RegExURL inputURL={url} />
                    </div>


                </div>

                {isLoading && (

                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <Logo />
                        {/* <div className="text-black text-xl">Website Preview Loading</div> */}
                        <Loader2 className='animate-spin ml-2' />
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={url}
                    className={`w-full h-full ${isLoading ? 'hidden' : ''}`}
                    title="URL Display"
                    onLoad={handleLoad}
                    onLoadStart={handleLoadStart}
                />
            </div>
        </div>
    );
}