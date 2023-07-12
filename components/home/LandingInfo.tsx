import Image from 'next/image'
import React from 'react'
import { VerticalFeatures } from './VerticalFeatures'

type MyComponentProps = {
  header: string
  services: {
    imageUrl: string
    description: string
  }[]
}

const LandingInfo: React.FC<MyComponentProps> = ({ header, services }) => {
  return (
<VerticalFeatures />
  )
}

export default LandingInfo;
