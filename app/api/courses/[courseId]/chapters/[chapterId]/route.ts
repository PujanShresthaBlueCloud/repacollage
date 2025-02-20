import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params : { courseId: string, chapterId: string }}
){
    try {
        const { userId } = auth();

        // need to manage isPublish separately
        const { isPublish, ...values} = await req.json();
        if ( !userId ) {
            return new NextResponse("Unauthorized user ", { status: 401 });
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });
        if ( !ownCourse ){
            return new NextResponse("Unauthorized user ", { status: 500 });
        }
        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        })
        // TODO: Handle video update

        return  NextResponse.json(chapter);
    } catch ( error ) {
        console.log("[COURSES CHAPTER ID ERROR ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}