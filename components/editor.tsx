"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
    onChange: ( value: string ) => void;
    value: string;
}

export const Editor = ({
    onChange,
    value
}: EditorProps) => {
    // Use client is not enough to load the page so need to write the following code
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), [])


    return (
        <div className="bg-white">
            <ReactQuill 
                theme="snow"
                value={value}
                onChange={onChange}          
            />
        </div>
    );
};