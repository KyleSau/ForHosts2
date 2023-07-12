import React, { ReactNode } from 'react';
import Navbar from './NavBar';
import Footer from '../footer';
import Meta from '../meta';
interface WithChildren {
  children?: ReactNode;
}

export default function HomeLayout({ children }: WithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Meta title="ForHosts Home Page" description="Helping hosts create their own websites simply and dynamically" />
      <Navbar />

      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  )
}
