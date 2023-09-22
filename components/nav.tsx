"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  Layout,
  LayoutDashboard,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  CalendarCheck2,
  Home,
  CircleDollarSign,
  FileQuestion,
  MessagesSquare,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getSiteFromPostId } from "@/lib/actions";
import Image from "next/image";

const externalLinks = [
  {
    name: "Guides",
    href: undefined,
    icon: <FileQuestion width={18} />,
  },
  {
    name: "Live Chat",
    href: "https://tawk.to/chat/64a6e01c94cf5d49dc61f524/1h4ltms4a",
    icon: <MessagesSquare width={18} />,
  },
  {
    name: "Blogs",
    href: "https://forhosts.com/blogs",
    icon: <BookOpen width={18} />,
  },
];

export default function Nav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [siteId, setSiteId] = useState<string | null>();

  useEffect(() => {
    if (segments[0] === "post" && id) {
      getSiteFromPostId(id).then((id) => {
        setSiteId(id);
      });
    }
  }, [segments, id]);

  const tabs = useMemo(() => {
    if (segments[0] === "site" && id) {
      return [
        {
          name: "Back to All Sites",
          href: "/sites",
          icon: <ArrowLeft width={18} />,
          suboptions: [],
        },
        {
          name: "Listings",
          href: `/site/${id}`,
          isActive: segments.length === 2,
          icon: <Newspaper width={18} />,
          suboptions: [],
        },
        {
          name: "Analytics",
          href: `/site/${id}/analytics`,
          isActive: segments.includes("analytics"),
          icon: <BarChart3 width={18} />,
          suboptions: [],
        },
        {
          name: "Settings",
          href: `/site/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
          suboptions: [],
        },
      ];
    } else if (segments[0] === "post" && id) {
      return [
        {
          name: "Back to All Rentals",
          href: siteId ? `/site/${siteId}` : "/sites",
          icon: <ArrowLeft width={18} />,
          suboptions: [],
        },
        {
          name: "Editor",
          href: `/post/${id}`,
          isActive: segments.length === 2,
          icon: <Edit3 width={18} />,
          suboptions: [
            {
              name: "Listing Details",
              href: "/site/1/option1",
              isActive: segments.includes("option1"),
            },
            {
              name: "Pricing",
              href: "/site/1/option2",
              isActive: segments.includes("option2"),
            },
            {
              name: "Availability",
              href: "/site/1/option1",
              isActive: segments.includes("option1"),
            },
            {
              name: "Policies & Rules",
              href: "/site/1/option1",
              isActive: segments.includes("option1"),
            },
            {
              name: "Info For Guests",
              href: "/site/1/option1",
              isActive: segments.includes("option1"),
            },
            {
              name: "Images",
              href: "/site/1/option1",
              isActive: segments.includes("option1"),
            },
          ],
        },
        {
          name: "Settings",
          href: `/post/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
          suboptions: [],
        },
      ];
    }
    return [
      {
        name: "Overview",
        href: "/",
        isActive: segments.length === 0,
        icon: <LayoutDashboard width={18} />,
        suboptions: [],
      },
      {
        name: "Websites",
        href: "/sites",
        isActive: segments[0] === "sites",
        icon: <Layout width={18} />,
        suboptions: [],
      },
      {
        name: "Listings",
        href: "/listings",
        isActive: segments[0] === "Listings",
        icon: <Home width={18} />,
        suboptions: [],
      },
      {
        name: "Reservations",
        href: "/reservations",
        isActive: segments[0] === "reservations",
        icon: <CalendarCheck2 width={18} />,
        suboptions: [],
      },
      {
        name: "Payments",
        href: "/payments",
        isActive: segments[0] === "payments",
        icon: <CircleDollarSign width={18} />,
        suboptions: [],
      },
      {
        name: "Calendar",
        href: "/calendar",
        isActive: segments[0] === "calendar",
        icon: <CalendarDays width={18} />,
        suboptions: [],
      },
      {
        name: "Inbox",
        href: "/inbox",
        isActive: segments[0] === "inbox",
        icon: <MessagesSquare width={18} />,
        suboptions: [],
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: segments[0] === "settings",
        icon: <Settings width={18} />,
        suboptions: [],
      }
    ];
  }, [segments, id, siteId]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={`fixed z-20 ${
          // left align for Editor, right align for other pages
          segments[0] === "post" && segments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
          } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${showSidebar ? "translate-x-0" : "-translate-x-full"
          } fixed z-10 flex h-full w-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 px-2 py-1.5">
            <Link
              href="/"
              className=" p-2"
            >
              <Image
                src="/ForHostsLogoWithoutSlug.svg"
                width={160}
                height={75}
                alt="Logo"
                className="dark:scale-110 dark:border-stone-400"
              />
            </Link>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon, suboptions }) => (
              <div key={name}>
                {/* Render main menu item */}
                <Link href={href} passHref>
                  <div className={`cursor-pointer flex items-center space-x-3 ${isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""}`}>
                    {icon}
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                </Link>

                {/* Render suboptions */}
                {suboptions.length > 0 && (
                  <div className="pl-6">
                    {suboptions.map(({ name, href, isActive }) => (
                      <Link key={name} href={href} passHref>
                        <div className={`cursor-pointer text-sm ${isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""}`}>
                          {name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p></p>
              </a>
            ))}
          </div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
