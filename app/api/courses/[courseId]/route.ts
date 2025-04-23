import  Mux  from "@mux/mux-node";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import toast from "react-hot-toast";

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    throw new Error("MUX_TOKEN_ID or MUX_TOKEN_SECRET is missing");
  }
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });

export async function DELETE(
    req:Request,
    { params } : { params: { courseId:string }}
){
    try {
        console.log("Inside the DELETE FUNCTION ROUTE" , params.courseId);
        console.log(params.courseId)
        
        const { userId } = auth();
        if(!userId) {
            console.log("No authorized user!!!")
            return new NextResponse("Unauthorized user", {status:401})
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
            return NextResponse.json("Course Not Found ", { status: 404});
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                console.log("inside the if chapter mux data", chapter.muxData.assetId)
                await mux.video.assets.delete(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            }
        })

        return  NextResponse.json(deletedCourse);

    } catch(error) {
        console.log("[COURSE_ID_DELETE", error)
        toast.error("Error on deleting course")
        return new NextResponse("Internal error ", { status: 500 })
    }
}

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