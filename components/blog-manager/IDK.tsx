"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react";
import { TiptapEditorProps } from "../editor/props";
import { TiptapExtensions } from "../editor/extensions";
import { EditorBubbleMenu } from "../editor/bubble-menu";
// import { TiptapEditorProps } from "./props";
// import { TiptapExtensions } from "./extensions";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
// import { EditorBubbleMenu } from "./bubble-menu";



export default function WYSIWYGEditor({ formik, field }: any) {


    // // const [data, setData] = useState<{ text: string }>({ text: text });
    // const [data, setData] = useState(text);

    const [hydrated, setHydrated] = useState(false);

    const editor = useEditor({
        extensions: TiptapExtensions,
        editorProps: TiptapEditorProps,
        onUpdate: (e) => {
            const selection = e.editor.state.selection;
            const lastTwo = e.editor.state.doc.textBetween(
                selection.from - 2,
                selection.from,
                "\n"
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
                // setData(text);
                formik.setFieldValue(field, e.editor.storage.markdown.getMarkdown());
                console.log('markdown: ' + e.editor.storage.markdown.getMarkdown());

                /*setData((prevData) => ({
                    ...prevData,
                    text: e.editor.storage.markdown.getMarkdown(),
                }));*/

            }
        },
        autofocus: "end",
    });

    const { complete, completion, isLoading, stop } = useCompletion({
        id: "novel",
        api: "/api/generate",
        onResponse: (response) => {
            if (response.status === 429) {
                toast.error("You have reached your request limit for the day.");
                va.track("Rate Limit Reached");
                return;
            }
        },
        onFinish: (_prompt, completion) => {
            editor?.commands.setTextSelection({
                from: editor.state.selection.from - completion.length,
                to: editor.state.selection.from,
            });
        },
        onError: () => {
            toast.error("Something went wrong.");
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
    // useEffect(() => {
    //     if (editor && text && !hydrated) {
    //         editor.commands.setContent(text);
    //         setHydrated(true);
    //     }
    // }, [editor, text, hydrated]);
    useEffect(() => {
        if (editor && !hydrated) {
            editor.commands.setContent(formik.values[field]);
            setHydrated(true);
            // IF THERE IS A BUG:
            // use this here: e.editor.storage.markdown.getMarkdown()
            // formik.setFieldValue(field, editor?.getText());
            // console.log('text/editor', editor.getText());
            // IF THERE IS ANOTHER BUG:
            // use useHydration
        }
    }, [editor, field]);


    return (
        <div className="w-full h-full">
            {editor && <EditorBubbleMenu editor={editor} />}
            <EditorContent placeholder="Enter text here..." className="p-[15px] border border-gray-200 rounded-md leading-normal overflow-none " editor={editor} />
        </div>
    );
}