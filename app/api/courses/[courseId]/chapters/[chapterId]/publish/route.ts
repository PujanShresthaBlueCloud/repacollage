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
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });
        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId
            }
        })
        if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl){
            return new NextResponse("Missing Required Fields", { status: 400 });
        }
        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublish: true
            }
        })
        return NextResponse.json(publishedChapter);
    } catch(error){
        toast.error("Error on Publish route");
        console.log("[CHAPTER_PUBLISH_ROUTE]", error);
        return new NextResponse("Internal Error", { status:500 })
    }
    
}