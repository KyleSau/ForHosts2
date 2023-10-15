import React from 'react'
import BlurImage from '@/components/blur-image'

export default function PhotoCard() {
    return (
        <div>
            <BlurImage
                alt={"User Avatar"}
                width={100}
                height={100}
                className="h-full w-full object-cover"
                src={ }
            />
        </div>
    )
}
