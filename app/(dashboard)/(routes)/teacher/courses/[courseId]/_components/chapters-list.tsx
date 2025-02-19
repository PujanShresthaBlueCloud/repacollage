"use client";
import { Chapter } from "@prisma/client";

interface ChapterListProps {
    items: Chapter[],
    onReorder: (updateData: {id: String; position: number}[]) => void;
    onEdit: (id: String) => void;
}
export const ChaptersList = ({
    items,
    onReorder,
    onEdit,
}: ChapterListProps) => {
    return (
        <div>
            chapter list
        </div>
    )
}