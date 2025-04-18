"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { boolean, string } from "zod";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ChapterActionsProps {
    disabled: boolean,
    courseId: string,
    chapterId: string,
    isPublish: boolean

}

export const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublish
}: ChapterActionsProps) => {
    const [ isLoading, setIsLoading ] = useState( false );
    const router = useRouter();
    const onClick =  async () => {
        try {
            console.log(" inside on click")
            setIsLoading ( true );
            if ( isPublish ) {
                await axios.patch ( `/api/courses/${courseId}/chapters/${chapterId}/unpublish` );
                toast.success("Chapter unpublished")
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter published")
            }
        } catch (error) {
            toast.error("Error on chapter publish");
            console.log("Error on publish");

        } finally {
            setIsLoading ( false );
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading ( true );
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Chapter deleted.")
            router.refresh;
            router.push(`/teacher/courses/${courseId}`);
        } catch (error) {
            toast.error("Something went wrong");
            console.log("error on delete ", error);
        } finally {
            setIsLoading ( false );
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublish ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfrim={onDelete}>
                <Button size="sm">
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}