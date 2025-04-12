import { Mux } from "@mux/mux-node";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    throw new Error("MUX_TOKEN_ID or MUX_TOKEN_SECRET is missing");
  }
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });


export async function PATCH(
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

       if ( values.videoUrl ) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });
            if ( existingMuxData ) {
            console.log(" inside patch existing data ----", existingMuxData)
                try {
                    const test =  await mux.video.assets.delete(existingMuxData.assetId);
                    await db.muxData.delete({
                        where: {
                            id: existingMuxData.id,
                        }
                    });
                }catch (error) {
                    console.log("inside existing error ---", error)
                }
            }

            console.log("Try in ---------")
            const asset = await mux.video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false,
            });
            console.log("Mux Asset Created: ------ ", asset.id);
          console.log("asset id below ", asset.id)
            
            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id || "no id",
                }
            });
        }
        return  NextResponse.json(chapter);
    } catch ( error ) {
        console.log("[COURSES CHAPTER ID ERROR ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}