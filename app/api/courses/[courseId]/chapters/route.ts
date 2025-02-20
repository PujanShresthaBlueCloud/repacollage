import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// function for submission of form as Post
export async function POST (
    req: Request, // to get the name of the form we do req: request
    {params}: {params: {courseId:string}}
){
    try{
        const { userId } = auth()
        const { title } = await req.json()


        if (!userId){
            return new NextResponse("Unauthorized user!", {status: 401})
        }
        
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorize user", {status: 401});
        }

        // to create a new chapter we have to get all the previous chapter that has been created and their position
        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId // getting course for finding its chapter 
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastChapter? lastChapter.position + 1 : 1;
        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition,
            }
        });
        return  NextResponse.json(chapter)

    } catch(error){
        console.log("[COURSE_CHAPTER_ERROR]: ", error)
        return new NextResponse("Internal error ", {status: 500})
    }
}
