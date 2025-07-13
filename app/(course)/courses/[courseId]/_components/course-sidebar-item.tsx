"use client";

import { CheckCircle, Lock, PlayCircle,  } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps{
    id: string;
    label: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
}
export const CourseSidebarItem=({
    id,
    label,
    isCompleted,
    courseId,
    isLocked
}:CourseSidebarItemProps)=>{
    const pathname = usePathname();
    const router = useRouter();
    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle )
    return(
        <div>
            <Icon/>
            {label}
        </div>
    )
}
export default CourseSidebarItem;