import React, { ReactNode } from 'react';
import Navbar from './nav-bar';
import Footer from '../footer';
import Meta from '../meta';
interface WithChildren {
  children?: ReactNode;
}

export default function HomeLayout({ children }: WithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  )
}
