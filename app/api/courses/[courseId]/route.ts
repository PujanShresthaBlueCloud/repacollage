import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// always makesure that the params goes after request because if no request the we cannot take url
export async function PATCH(
    req:Request,
    { params } : { params: { courseId:string }}
){

    try {
        const { userId } = auth();
        const { courseId } = params;
        const values  = await req.json();
        if (!userId){
            return new NextResponse("Internal Error", {status: 401});
        }

        const course = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                ...values,
            }
        })
        return NextResponse.json(course);
    } catch(error) {
        console.log("[COURSE_ID", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}