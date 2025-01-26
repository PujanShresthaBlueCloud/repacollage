import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST( req: Request) {
    try {
        const { userId } = auth();
        const { title } = await req.json();
        // console.log("user id", userId);
        // console.log("title", title);

        if (!userId) {
            return new NextResponse("Unauthorize", { status: 401 });
        }
        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        })
        return NextResponse.json(course);
    } catch( error ) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}