import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// delete function
export async function DELETE(
    req:Request, // for the url
    {params}: {params: {courseId: string, attachmentId: string}}
){
    try{
        const { userId } = auth()
        // const { url } = await req.json()
        if (!userId) {
            return new NextResponse("Unauthorized user !", {status: 401});
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });
        if (!courseOwner) {
            return new NextResponse("Unauthorized user ! ", {status: 401});
        };

        const attachment = await db.attachment.delete({
            where: {
                id: params.attachmentId,
                courseId: params.courseId,
            }
        });
        return NextResponse.json(attachment);

    } catch(error) {
        console.error("ATTACHMENT DELETE ERROR !", error)
        return new NextResponse("Internal error ", {status: 500})
    }
}