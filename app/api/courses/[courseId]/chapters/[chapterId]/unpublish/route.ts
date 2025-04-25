import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import toast from "react-hot-toast";

export async function PATCH(
    req: Request,
    { params }: { params: { chapterId: string; courseId: string }}
){
    try {
        const { userId } = auth();
        if(!userId){
            return new NextResponse("Unauthorized User", { status: 401 });
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if(!ownCourse){
            return new NextResponse("Unauthorized Course Owner", { status:401 });
        }
        
        const unPublishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublish: false
            }
        })

        const course = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublish: false
            }
        });
        return NextResponse.json(unPublishedChapter);
    } catch(error){
        toast.error("Error on UnPublish route");
        console.log("[CHAPTER_UNPUBLISH_ROUTE]", error);
        return new NextResponse("Internal Error", { status:500 })
    }
    
}