"use client";
import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { on } from "events";

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
    const [isMounted, setIsMounted ] = useState(false);
    const [chapters, setChapters ] = useState(items);

    // due to drag and drop option hydration error may arise so the following code is necessary
    useEffect(() => {
        setIsMounted(true);
    },[])

    useEffect(()=>{
        setChapters(items)
    },[items])
    
    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={()=>{}}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter, index) => (
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                            chapter.isPublish && "bg-sky-100 border-sky-200 text-sky-700"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div className={cn(
                                                "px-2 py-3 border-r border-r-slate-200 hover: rounded-l-md transition",
                                                chapter.isFree && "border-r-sky-200 hover:bg-sky-200"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip
                                                className="h-5 w-5"
                                            />
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {chapter.isFree && (
                                                <Badge>
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge
                                                className={cn(
                                                    "bg-slate-500",
                                                    chapter.isPublish && "bg-sky-700"
                                                )}
                                            >
                                                {chapter.isPublish ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil
                                                onClick={() => onEdit(chapter.id)}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"

                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}