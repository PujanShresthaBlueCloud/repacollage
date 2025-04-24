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
    });
    if(!course){
        return new NextResponse("Course Not Found", {status: 404});
    }
    
    const unPublishedCourse = await db.course.update({
        where: {
            id: params.courseId,
            userId,
        },
        data: {
            isPublish: false
        }
    });
    
    return NextResponse.json(unPublishedCourse);
 } catch(error){
    toast.error("Course Publish error");
    console.log("[COURSE UNPUBLISH ERROR]", error);
    return new NextResponse("Internal Error", {status: 500});
 }
}