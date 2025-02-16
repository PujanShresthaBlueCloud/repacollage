import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(
        req:Request,
        {params}: {params: {courseId: string }}
){
    try{
        const { userId } = auth();
        const { url } = await req.json();

        if (!userId){
            return  new NextResponse("Unauthorized user!", {status: 401})
        }
        
        const filename = url ? url.split('/').pop() : "default_name"; // Ensure url is valid
        console.log("Extracted filename:", filename); // Debugging

        const attachment = await db.attachment.create({
            data: {
                url,
                name: filename || "undefined",
                courseId: params.courseId,
            }
        });
        return NextResponse.json(attachment);
    } catch (error){
        console.log("COURSE_ID_ATTACHMENTS ", error);
        return new NextResponse("Internal error ", {status: 500})
    }
}