"use client";
import * as z from "zod";
import axios from "axios";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { Chapter, Course, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import MuxPlayer from "@mux/mux-player-react";

//declaring database schema getting the description attribute to be update
const formSchema = z.object({
    videoUrl: z.string().min(1)
})

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string
};

//Description form component
export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,
}:ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current)=> !current);
    const router = useRouter();
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        if (!courseId) throw new Error("courseId is required");
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            // await axios.post(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast("Course update successfully");
            toggleEdit();
            router.refresh();
        } catch ( error ) {
            toast.error("Something went wrong while updating video ");
            console.log("Video updating error in chapter video form", error)
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                                Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Video
                            </>
                        )
                    }
                </Button>
            </div>
            <div>
                {!isEditing && (
                    !initialData.videoUrl ? (
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <Video className="h-10 w-10 text-slate-500"/>
                        </div>
                    ) :
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>

                )}
                {isEditing && (
                    <div>
                        <FileUpload
                            endpoint="chapterVideo"
                            onChange={(url)=> {
                                console.log("url is heree!!! ", url)
                                if(url){
                                    onSubmit({videoUrl: url})
                                }
                            }}
                        />
                        <div className="text-ts text-muted-foreground mt-4">
                            Uplaod this chapter&apos;s video
                        </div>
                    </div>
                )}
                {initialData.videoUrl && !isEditing && (
                    <div className="text-sm text-muted-foreground mt-2">
                        Videos can take a few minutes to process. Refresh the page if video does not appear.
                    </div>
                )}
            </div>
        </div>
    )
} // end of component