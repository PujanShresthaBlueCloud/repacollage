"use client";
import * as z from "zod";
import axios from "axios";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";

//declaring database schema getting the description attribute to be update
const formSchema = z.object({
    imageURL: z.string().min(1, {
        message: "Image is required",
    })
})

interface ImageFormProps {
    initialData: Course
    courseId: string;
};


//Description form component
export const ImageForm = ({
    initialData,
    courseId 
}:ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current)=> !current);
    const router = useRouter();
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        if (!courseId) throw new Error("courseId is required");
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast("Course update successfully");
            toggleEdit();
            router.refresh();
        } catch(error){
            toast.error("Something went wronge while updating Image");
            console.log("Image updating error", error)
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageURL && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                                Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageURL && (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Image
                            </>
                        )
                    }
                </Button>
            </div>
            <div>
                {!isEditing && (
                    !initialData.imageURL ? (
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <ImageIcon className="h-10 w-10 text-slate-500"/>
                        </div>
                    ) :
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="upload" fill className="object-cover rounded-md" src={initialData.imageURL} />
                    </div>

                )}
                {isEditing && (
                    <div>
                        <FileUpload
                            endpoint="courseImage"
                            onChange={(url)=> {
                                // console.log("url is heree!!! ", url)
                                if(url){
                                    onSubmit({imageURL: url})
                                }
                            }}
                        />
                        <div className="text-ts text-muted-foreground mt-4">
                            16:9 aspect ratio recommended
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} // end of component


