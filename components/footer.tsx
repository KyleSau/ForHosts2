"use client";
import NextLink from 'next/link';
import { FacebookIcon, LinkedinIcon, TwitterIcon } from 'react-share';
import Container from './container';
import Link from 'next/link';
import Logo from './Logo';
type SingleFooterListItem = { title: string; href: string };
type FooterListItems = SingleFooterListItem[];
type SingleFooterList = { title: string; items: FooterListItems };
type FooterItems = SingleFooterList[];

const footerItems: FooterItems = [
  {
    title: 'Company',
    items: [
      { title: 'Privacy Policy', href: '/privacy-policy' },
      { title: 'Cookies Policy', href: '/cookies-policy' },
    ],
  },
  {
    title: 'Product',
    items: [
      { title: 'Features', href: '/features' },
      { title: 'Something', href: '/something' },
      { title: 'Something else', href: '/something-else' },
      { title: 'And something else', href: '/and-something-else' },
    ],
  },
  {
    title: 'Knowledge',
    items: [
      { title: 'Blog', href: '/blog' },
      { title: 'Contact', href: '/contact' },
      { title: 'FAQ', href: '/faq' },
      { title: 'Help Center', href: '/help-center' },
    ],
  },
  {
    title: 'Something',
    items: [
      { title: 'Features2', href: '/features2' },
      { title: 'Something2', href: '/something2' },
      { title: 'Something else2', href: '/something-else2' },
      { title: 'And something else2', href: '/and-something-else2' },
    ],
  },
];

function Footer() {
  return (
    // <footer className="pt-2 pb-2 bg-gray-400 text-textSecondary">
    //   <Container>
    //     <div className="flex flex-col justify-center items-center mt-24 md:flex-col">
    //       <div className="flex space-x-4 justify-center">
    //         <NextLink href="https://www.twitter.com/my-saas-startup" passHref legacyBehavior>
    //           <a>
    //             <TwitterIcon size={50} round={true} />
    //           </a>
    //         </NextLink>

    //         <NextLink href="https://www.facebook.com/profile.php?id=100091349487748" passHref legacyBehavior>
    //           <a>
    //             <FacebookIcon size={50} round={true} />
    //           </a>
    //         </NextLink>

    //         <NextLink href="https://www.linkedin.com/my-saas-startup" passHref legacyBehavior>
    //           <a>
    //             <LinkedinIcon size={50} round={true} />
    //           </a>
    //         </NextLink>
    //       </div>
    //       <p className="text-lg mt-2 text-center">&copy; ForHosts 2023</p>
    //     </div>
    //   </Container>
    // </footer>
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="flex justify-center items-center">
        <Link className="" href="/">
          <Logo />
        </Link>
      </div>
      <div className="mx-auto max-w-screen-xl text-center">
        <ul className="flex flex-wrap justify-center items-center text-gray-900 dark:text-white">
          <li>
            <a href="#" className="mr-4 hover:opacity-80 md:mr-6 ">About</a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:opacity-80 md:mr-6">Blog</a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:opacity-80 md:mr-6">Affiliate Program</a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:opacity-80 md:mr-6">FAQs</a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:opacity-80 md:mr-6">Contact</a>
          </li>
        </ul>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="#" className="hover:underline">ForHosts™</a>. All Rights Reserved.</span>
      </div>
    </footer>
  );
}



function FooterList({ title, items }: SingleFooterList) {
  return (
    <div className="flex flex-col mb-20 mr-20 space-y-4 md:flex-0 md:w-40 lg:flex-0 lg:w-full lg:mr-0">
      <p className="font-bold text-2xl mb-10">{title}</p>
      <div className="flex">
        {items.map((singleItem) => (
          <ListItem key={singleItem.href} {...singleItem} />
        ))}
      </div>
    </div>
  );
}

function ListItem({ title, href }: SingleFooterListItem) {
  return (
    <p className="text-xl mr-4">
      <NextLink href={href} passHref legacyBehavior>
        <a className="text-textSecondary opacity-75 no-underline">{title}</a>
      </NextLink>
    </p>
  );
}

export default Footer;