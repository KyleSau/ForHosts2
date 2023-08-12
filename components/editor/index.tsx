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

type PostWithSite = Post & { site: { subdomain: string | null } | null };

export default function Editor({ post }: { post: PostWithSite }) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();

  const [data, setData] = useState<PostWithSite>(post);
  const [hydrated, setHydrated] = useState(false);
  const [showCheckTimes, setShowCheckTimes] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);

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

    if(!availabilityWindow || availabilityWindow.length == 0) { 
      availabilityWindow = ["",""];
    } else if (availabilityWindow.length < 2) {
      availabilityWindow.push("");
    }

    if(scope) { //if function is called from parent component
      if(index === 0) { //start date
        availabilityWindow[0] = date;
      } else if (index === 1) { //end date
        //if called from parent AND is setting the end date, then this means host is setting a custom date
        setSliderIdx(sliderIntervals.length-1);
        availabilityWindow[1] = date;
      }
    } else { //if function is called from child component via being passed as a callback
      if (index === 1) {
        availabilityWindow[1] = date;
      }
    }
    setData({ ...data, availabilityWindow });
  };

  const setTimeOfDay = async (event: any) => {
    const inputTimeValue = event.target.value;
    // console.log("inputTimeValue: ", inputTimeValue);
    // const inputTime = new Date(inputTimeValue);
    // console.log("inputTime: ", inputTime);
    // const inputTimeFormatted = inputTime.toLocaleTimeString();
    // console.log("inputTimeFormatted: ", inputTimeFormatted);
    setData({ ...data, checkInTime: event.target.value });
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
      <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
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
      </div>
      <div className="mb-5 flex flex-col space-y-3 border-b border-stone-200 pb-5 dark:border-stone-700">
        <input
          type="text"
          placeholder="Title of Property"
          defaultValue={post?.title || ""}
          autoFocus
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="dark:placeholder-text-600 border-none px-0 font-cal text-3xl placeholder:text-stone-400 focus:outline-none  focus:ring-0"
        />

        <TextareaAutosize
          placeholder="Description of Property"
          defaultValue={post?.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none  focus:ring-0"
        />
      </div>
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
      <div
        className="flex cursor-pointer justify-center"
        onClick={() => setShowCheckTimes(!showCheckTimes)}
      >
        <h1 className="flex items-center mb-12 mt-12 text-3xl font-bold">
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
              <Info className="ml-2 opacity-90 stroke-[1px]"/> 
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
              <Info className="ml-2 opacity-90 stroke-[1px]"/> 
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
        <h1 className="flex items-center mb-14 text-3xl font-bold">
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
    </div>
  );
}
