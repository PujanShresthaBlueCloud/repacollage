"use client"

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { boolean, string } from "zod";
import { ConfirmModal } from "@/components/modals/confirm-modal";

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
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={()=>{}}
                disabled={disabled}
                variant="outline"
                size="sm"
            >
                {isPublish ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfrim={()=>{}}>
                <Button size="sm">
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
            
        </div>
    )
}