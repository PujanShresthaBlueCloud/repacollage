import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import toast from "react-hot-toast";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string }}
){
  try {
    const { userId } = auth();
    if(!userId){
        return new NextResponse("Unauthorized User", {status: 401});
    }
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId,
        },
        include: {
            chapters: {
                include: {
                    muxData: true,
                }
            }
        }
    });
    if(!course){
        return new NextResponse("Course Not Found", {status: 404});
    }
    const hasPublishedChapter = course.chapters.some((chapter)=> chapter.isPublish);
    console.log("Has published chapter", hasPublishedChapter);

    if(!course.title || !course.description || !course.imageURL || !course.categoryId || !hasPublishedChapter){
        return new NextResponse("Missing Required Fields", {status: 401});
    }
    const publishedCourse = await db.course.update({
        where: {
            id: params.courseId,
            userId,
        },
        data: {
            isPublish: true
        }
    });
    
    return NextResponse.json(publishedCourse);
 } catch(error){
    toast.error("Course Publish error");
    console.log("[COURSE PUBLISH ERROR]", error);
    return new NextResponse("Internal Error", {status: 500});
 }
}