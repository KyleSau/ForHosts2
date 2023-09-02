"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useDebounce } from "use-debounce";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { useTransition } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { EditorBubbleMenu } from "./bubble-menu";
import { Post } from "@prisma/client";
import { updatePost, updatePostMetadata } from "@/lib/actions";
import clsx from "clsx";
import LoadingDots from "../icons/loading-dots";
import { ExternalLink, Info } from "lucide-react";
import DateSlider from "../booking/date-slider";
import { Tooltip } from "@mui/material";
import { FileClickDragDrop } from "./file-drag-drop";

type PostWithSite = Post & { site: { subdomain: string | null } | null };

export default function Editor({ post }: { post: PostWithSite }) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();

  const [data, setData] = useState<PostWithSite>(post);
  const [hydrated, setHydrated] = useState(false);
  const [showCheckTimes, setShowCheckTimes] = useState(true);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showAddPhotoArea, setShowAddPhotoArea] = useState(true);
 
  const [activeTab, setActiveTab] = useState('app'); // Initialize the active tab state

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab when a button is clicked
  }

  const sliderIntervals = ["1 mo", "2 mo", "3 mo", "4 mo", "5 mo", "6 mo", "1 yr", "custom"];
  const [sliderIdx, setSliderIdx] = useState(0);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`;

  const [debouncedData] = useDebounce(data, 1000);
  useEffect(() => {
    // compare the title, description and content only
    if (
      debouncedData.title === post.title &&
      debouncedData.price === post.price &&
      debouncedData.description === post.description &&
      debouncedData.content === post.content &&
      debouncedData.checkInTime === post.checkInTime &&
      debouncedData.checkOutTime === post.checkOutTime &&
      debouncedData.location === post.location &&
      debouncedData.currency === post.currency &&
      debouncedData.minimumStay === post.minimumStay &&
      debouncedData.cleaningFee === post.cleaningFee &&
      debouncedData.securityDeposit === post.securityDeposit &&
      JSON.stringify(debouncedData.amenities) ===
      JSON.stringify(post.amenities) &&
      debouncedData.maxGuests === post.maxGuests &&
      debouncedData.bedrooms === post.bedrooms &&
      debouncedData.totalBeds === post.totalBeds &&
      debouncedData.bathrooms === post.bathrooms &&
      debouncedData.instantBooking === post.instantBooking &&
      debouncedData.rating === post.rating &&
      JSON.stringify(debouncedData.calendarUrls) ===
      JSON.stringify(post.calendarUrls) &&
      JSON.stringify(debouncedData.photoGallery) ===
      JSON.stringify(post.photoGallery) &&
      JSON.stringify(debouncedData.additionalServices) ===
      JSON.stringify(post.additionalServices) &&
      JSON.stringify(debouncedData.availabilityWindow) ===
      JSON.stringify(post.availabilityWindow)
    ) {
      return;
    }
    startTransitionSaving(async () => {
      await updatePost(debouncedData);
    });
  }, [debouncedData, post]);

  // listen to CMD + S and override the default behavior
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "s") {
        e.preventDefault();
        startTransitionSaving(async () => {
          await updatePost(data);
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [data, startTransitionSaving]);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      const selection = e.editor.state.selection;
      const lastTwo = e.editor.state.doc.textBetween(
        selection.from - 2,
        selection.from,
        "\n",
      );
      if (lastTwo === "++" && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        // we're using this for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
        complete(e.editor.getText());
        // complete(e.editor.storage.markdown.getMarkdown());
        va.track("Autocomplete Shortcut Used");
      } else {
        setData((prev) => ({
          ...prev,
          content: e.editor.storage.markdown.getMarkdown(),
        }));
      }
    },
  });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
      if (err.message === "You have reached your request limit for the day.") {
        va.track("Rate Limit Reached");
      }
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent("++");
      }
    };
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm("AI writing paused. Continue?")) {
        complete(editor?.getText() || "");
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);

  // Hydrate the editor with the content
  useEffect(() => {
    if (editor && post?.content && !hydrated) {
      editor.commands.setContent(post.content);
      setHydrated(true);
    }
  }, [editor, post, hydrated]);

  /**
   * Sets the availability window array (2 string dates in yyyy-MM-dd format) eg. ['2023-07-18', '2023-09-18']
   * to be passed into data. Also contains callbacks for setting the slider based on conditions.
   * @param date The date string to set
   * @param index Declare which date it is, 0 for starting date, 1 for ending date
   * @param scope Determines slider behavior. Set to true if being called from parent, false if being called from a child component.
   */
  const setAvailabilityWindowTimes = async (date: string, index: number, scope: boolean) => {
    let availabilityWindow = data.availabilityWindow;

    if (!availabilityWindow || availabilityWindow.length == 0) {
      availabilityWindow = ["", ""];
    } else if (availabilityWindow.length < 2) {
      availabilityWindow.push("");
    }

    if (scope) { //if function is called from parent component
      if (index === 0) { //start date
        availabilityWindow[0] = date;
      } else if (index === 1) { //end date
        //if called from parent AND is setting the end date, then this means host is setting a custom date
        setSliderIdx(sliderIntervals.length - 1);
        availabilityWindow[1] = date;
      }
    } else { //if function is called from child component via being passed as a callback
      if (index === 1) {
        availabilityWindow[1] = date;
      }
    }
    setData({ ...data, availabilityWindow });
  };
 
  return (
    
      
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
      <div className="relative">
      <ul className="relative flex flex-wrap p-1 list-none bg-transparent rounded-xl" nav-pills role="tablist">
      <li className={` flex-auto text-center ${activeTab === 'app' ? 'bg-gray-200 rounded-xl text-gray-600 shadow-md' : 'bg-transparent rounded-xl text-slate-700 w-'}`}>
            <a
              className="flex flex-col items-center w-full px-0 py-1 mb-0 transition-all border-0 rounded-lg ease-soft-in-out bg-inherit text-slate-700"
              href="javascript:;"
              onClick={() => handleTabClick('app')} // Set the active tab when clicking
              aria-selected={activeTab === 'app' ? 'true' : 'false'}
            >
              <svg className="text-slate-700" width="16px" height="16px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-2319.000000, -291.000000)" fill="#FFFFFF" fillRule="nonzero">
              <g transform="translate(1716.000000, 291.000000)">
                <g transform="translate(603.000000, 0.000000)">
                  <path className="fill-slate-800" d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z"></path>
                  <path className="fill-slate-800" d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z" opacity="0.7"></path>
                  <path className="fill-slate-800" d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z" opacity="0.7"></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <span className="ml-1">General Info</span>
      </a>
    </li>
    <li className={`z-30 flex-auto text-center ${activeTab === 'HomeInfo' ? 'bg-gray-200 rounded-xl text-gray-600 shadow-md' : 'bg-transparent rounded-xl text-slate-700 w-'}`}>
    <a
              className="flex flex-col items-center w-full px-0 py-1 mb-0 transition-all border-0 rounded-lg ease-soft-in-out bg-inherit text-slate-700"
              href="javascript:;"
              onClick={() => handleTabClick('HomeInfo')} // Set the active tab when clicking
            >
      <svg className="text-slate-700" width="16px" height="16px" viewBox="0 0 40 44" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <title>document</title>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-1870.000000, -591.000000)" fill="#FFFFFF" fillRule="nonzero">
              <g transform="translate(1716.000000, 291.000000)">
                <g transform="translate(154.000000, 300.000000)">
                  <path className="fill-slate-800" d="M40,40 L36.3636364,40 L36.3636364,3.63636364 L5.45454545,3.63636364 L5.45454545,0 L38.1818182,0 C39.1854545,0 40,0.814545455 40,1.81818182 L40,40 Z" opacity="0.603585379"></path>
                  <path className="fill-slate-800" d="M30.9090909,7.27272727 L1.81818182,7.27272727 C0.814545455,7.27272727 0,8.08727273 0,9.09090909 L0,41.8181818 C0,42.8218182 0.814545455,43.6363636 1.81818182,43.6363636 L30.9090909,43.6363636 C31.9127273,43.6363636 32.7272727,42.8218182 32.7272727,41.8181818 L32.7272727,9.09090909 C32.7272727,8.08727273 31.9127273,7.27272727 30.9090909,7.27272727 Z M18.1818182,34.5454545 L7.27272727,34.5454545 L7.27272727,30.9090909 L18.1818182,30.9090909 L18.1818182,34.5454545 Z M25.4545455,27.2727273 L7.27272727,27.2727273 L7.27272727,23.6363636 L25.4545455,23.6363636 L25.4545455,27.2727273 Z M25.4545455,20 L7.27272727,20 L7.27272727,16.3636364 L25.4545455,16.3636364 L25.4545455,20 Z"></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <span className="ml-1">Home Information</span>
      </a>
    </li>
    <li className="flex-auto text-center">
    <a className=" flex flex-col items-center w-full px-0 py-1 mb-0 transition-all border-0 rounded-lg ease-soft-in-out bg-inherit text-slate-700" nav-link href="javascript:;" role="tab" aria-selected="false">
        <svg className="text-slate-700" width="16px" height="16px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <title>settings</title>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-2020.000000, -442.000000)" fill="#FFFFFF" fillRule="nonzero">
              <g transform="translate(1716.000000, 291.000000)">
                <g transform="translate(304.000000, 151.000000)">
                  <polygon className="fill-slate-800" opacity="0.596981957" points="18.0883333 15.7316667 11.1783333 8.82166667 13.3333333 6.66666667 6.66666667 0 0 6.66666667 6.66666667 13.3333333 8.82166667 11.1783333 15.315 17.6716667"></polygon>
                  <path className="fill-slate-800" d="M31.5666667,23.2333333 C31.0516667,23.2933333 30.53,23.3333333 30,23.3333333 C29.4916667,23.3333333 28.9866667,23.3033333 28.48,23.245 L22.4116667,30.7433333 L29.9416667,38.2733333 C32.2433333,40.575 35.9733333,40.575 38.275,38.2733333 L38.275,38.2733333 C40.5766667,35.9716667 40.5766667,32.2416667 38.275,29.94 L31.5666667,23.2333333 Z" opacity="0.596981957"></path>
                  <path className="fill-slate-800" d="M33.785,11.285 L28.715,6.215 L34.0616667,0.868333333 C32.82,0.315 31.4483333,0 30,0 C24.4766667,0 20,4.47666667 20,10 C20,10.99 20.1483333,11.9433333 20.4166667,12.8466667 L2.435,27.3966667 C0.95,28.7083333 0.0633333333,30.595 0.00333333333,32.5733333 C-0.0583333333,34.5533333 0.71,36.4916667 2.11,37.89 C3.47,39.2516667 5.27833333,40 7.20166667,40 C9.26666667,40 11.2366667,39.1133333 12.6033333,37.565 L27.1533333,19.5833333 C28.0566667,19.8516667 29.01,20 30,20 C35.5233333,20 40,15.5233333 40,10 C40,8.55166667 39.685,7.18 39.1316667,5.93666667 L33.785,11.285 Z"></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <span className="ml-1">Listing Settings</span>
      </a>
    </li>
  </ul>
      </div>
      <hr />
      {/* <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
        
        {data.published && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <div className="rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400 dark:bg-stone-800 dark:text-stone-500">
          {isPendingSaving ? "Saving..." : "Saved"}
        </div>
        <button
          onClick={() => {
            const formData = new FormData();
            console.log(data.published, typeof data.published);
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updatePostMetadata(formData, post.id, "published").then(
                () => {
                  toast.success(
                    `Successfully ${data.published ? "unpublished" : "published"
                    } your post.`,
                  );
                  setData((prev) => ({ ...prev, published: !prev.published }));
                },
              );
            });
          }}
          className={clsx(
            "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
            isPendingPublishing
              ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              : "border border-black bg-black text-white hover:bg-sitecolor hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200",
          )}
          disabled={isPendingPublishing}
        >
          {isPendingPublishing ? (
            <LoadingDots />
          ) : (
            <p>{data.published ? "Edit Listing" : "Publish Listing"}</p>
          )}
        </button>
      </div> */}
          {activeTab === 'app' && (
            <div className="p-5">
    <div className="mx-4 p-4">
        <div className="flex items-center">
            <div className="flex items-center text-teal-600 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bookmark ">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">Personal</div>
            </div>
            <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"></div>
            <div className="flex items-center text-white relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user-plus ">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">Account</div>
            </div>
            <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
            <div className="flex items-center text-gray-500 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mail ">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">Message</div>
            </div>
            <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
            <div className="flex items-center text-gray-500 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-database ">
                        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">Confirm</div>
            </div>
        </div>
    </div>
    <div className="mt-8 p-4">
        <div>
            <div className="font-bold text-gray-600 text-xs leading-8 uppercase h-6 mx-2 mt-3">Full Name</div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="First Name" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="Last Name" className="p-1 px-2 appearance-none outline-none w-full text-gray-800"/> </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                    <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Username</div>
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="Just a hint.." className="p-1 px-2 appearance-none outline-none w-full text-gray-800"/> </div>
                </div>
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                    <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Your Email</div>
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="jhon@doe.com" className="p-1 px-2 appearance-none outline-none w-full text-gray-800"/> </div>
                </div>
            </div>
        </div>
        <div className="flex p-2 mt-4">
            <button className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
        hover:bg-gray-200  
        bg-gray-100 
        text-gray-700 
        border duration-200 ease-in-out 
        border-gray-600 transition">Previous</button>
            <div className="flex-auto flex flex-row-reverse">
                <button className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
        hover:bg-teal-600  
        bg-teal-600 
        text-teal-100 
        border duration-200 ease-in-out 
        border-teal-600 transition">Next</button>
                <button className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
        hover:bg-teal-200  
        bg-teal-100 
        text-teal-700 
        border duration-200 ease-in-out 
        border-teal-600 transition">Skip</button>
            </div>
        </div>
    </div>
</div>
      )}
      {activeTab === 'HomeInfo' && (
        <div>test</div>
      )}
      {/* {editor && <EditorBubbleMenu editor={editor} />} */}
      {/* <EditorContent editor={editor} /> */}
      {/* <div
        className="flex cursor-pointer justify-center"
        onClick={() => setShowCheckTimes(!showCheckTimes)}
      >
        <h1 className="flex items-center mb-6 mt-12 text-3xl font-bold">
          Booking Window {showCheckTimes ? "↑" : "↓"}
        </h1>
      </div>
      <div
        style={{
          maxHeight: showCheckTimes ? "1000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease-in-out",
        }}
      >
      
        <div className="mb-2">
          <h2 className="font-cal text-xl font-bold">In-Service Date</h2>
          <input
            type="date"
            value={data?.availabilityWindow[0]}
            onChange={(e) => setAvailabilityWindowTimes(e.target.value, 0, true)}
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
        <div className="mb-6">
          <h2 className="font-cal text-xl font-bold">Out-of-Service Date</h2>
          <DateSlider
            availabilityWindow={data?.availabilityWindow}
            setAvailabilityWindowTimes={setAvailabilityWindowTimes}
            sliderIntervals={sliderIntervals}
            sliderIdx={sliderIdx}
            setSliderIdx={setSliderIdx}
          />
          <input
            type="date"
            value={data?.availabilityWindow[1]}
            onChange={(e) => setAvailabilityWindowTimes(e.target.value, 1, true)}
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>

        <div className="mb-2">
          <div className="flex">
            <h2 className="font-cal text-xl font-bold">Time of Day for Guest Check-in</h2>
            <Tooltip title="Time of day that the guest is able to check in on their first day.">
              <Info className="ml-2 opacity-90 stroke-[1px]" />
            </Tooltip>
          </div>
          <input
            type="time"
            defaultValue={data.checkInTime.toString()}
            onChange={(e) => setData({ ...data, checkInTime: e.target.value })}
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
        <div className="mb-6">
          <div className="flex">
            <h2 className="font-cal text-xl font-bold">Time of Day for Guest Check-out</h2>
            <Tooltip title="Time of day by which the guest must check-out on their last day.">
              <Info className="ml-2 opacity-90 stroke-[1px]" />
            </Tooltip>
          </div>
          <input
            type="time"
            defaultValue={data.checkOutTime.toString()}
            onChange={(e) => setData({ ...data, checkOutTime: e.target.value })}
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div
        className="flex cursor-pointer justify-center"
        onClick={() => setShowPropertyDetails(!showPropertyDetails)}
      >
        <h1 className="flex items-center mb-8 mt-8 text-3xl font-bold">
          Property Details {showPropertyDetails ? "↑" : "↓"}
        </h1>
      </div>
      <div
        style={{
          maxHeight: showPropertyDetails ? "1000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease-in-out",
        }}
      >
        <input
          type="text"
          placeholder="Amenities (comma separated)"
          defaultValue={post?.amenities?.join(", ") || ""}
          onChange={(e) =>
            setData({ ...data, amenities: e.target.value.split(", ") })
          }
          className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
        />
        <div className="mb-2 mt-4">
          <input
            type="text"
            placeholder="iCal Calendar URLs (comma separated)"
            defaultValue={post?.calendarUrls?.join(", ") || ""}
            onChange={(e) =>
              setData({ ...data, calendarUrls: e.target.value.split(", ") })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
        <div className="mb-4">
          <h2 className="font-cal text-xl font-bold"> Currency</h2>
          <select
            defaultValue={post?.currency || "USD"}
            onChange={(e) => setData({ ...data, currency: e.target.value })}
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          >
            <option value="USD">USD</option>
          </select>
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Price per night at property"
            defaultValue={post?.price || ""}
            onChange={(e) =>
              setData({ ...data, price: parseInt(e.target.value, 10) })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
  
        <div className="mb-4">
          <input 
            type="number"
            placeholder="Maximum number of guests allowed for stay"
            defaultValue={post?.price || ""}
            onChange={(e) =>
              setData({ ...data, maxGuests: parseInt(e.target.value, 10) })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Minimum stay required at property (days)"
            defaultValue={post?.minimumStay || ""}
            onChange={(e) =>
              setData({ ...data, minimumStay: parseInt(e.target.value, 10) })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Maximum number of guests that can stay at property"
            defaultValue={post?.maxGuests || ""}
            onChange={(e) =>
              setData({ ...data, maxGuests: parseInt(e.target.value, 10) })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Number of Rooms"
            defaultValue={post?.bedrooms || ""}
            onChange={(e) =>
              setData({ ...data, bedrooms: parseInt(e.target.value, 10) })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Number of avaliable beds"
            defaultValue={post?.totalBeds || ""}
            onChange={(e) =>
              setData({ ...data, totalBeds: parseInt(e.target.value, 10) })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Number of bathrooms"
            defaultValue={post?.bathrooms || ""}
            onChange={(e) =>
              setData({ ...data, bathrooms: parseInt(e.target.value, 10) })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Cleaning fee"
            defaultValue={post?.cleaningFee || ""}
            onChange={(e) =>
              setData({ ...data, cleaningFee: parseInt(e.target.value, 10) })
            }
            className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
          />
        </div>
 
        <input
          type="number"
          placeholder="Security deposit"
          defaultValue={post?.securityDeposit || ""}
          onChange={(e) =>
            setData({ ...data, securityDeposit: parseInt(e.target.value, 10) })
          }
          className="dark:placeholder-text-600 placeholder-text-stone-400 w-full rounded-md border border-black px-0 font-cal text-xl focus:border-black focus:bg-sitecolor focus:outline-none focus:ring-0"
        />
      </div>

      <div
        className="flex cursor-pointer justify-center"
        onClick={() => setShowAddPhotoArea(!showAddPhotoArea)}
      >
        <h1 className="flex items-center mb-8 mt-12 text-3xl font-bold">
          Photos {showAddPhotoArea ? "↑" : "↓"}
        </h1>
      </div>
      <div
        style={{
          maxHeight: showAddPhotoArea ? "1000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease-in-out",
        }}
      >
        <FileClickDragDrop 
          componentId="listing-photos-drag-drop-area"
          
        />
      
      </div> */}

    </div>
    
  );
}
