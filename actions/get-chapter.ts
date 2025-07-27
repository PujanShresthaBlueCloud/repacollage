import { db } from "@/lib/db";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({
    userId,
    courseId,
    chapterId,
}: GetChapterProps ) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                }
            }
        });
        const course = await db.course.findUnique({
            where: {
                isPublish: true,
                id: courseId,
            },
            select: {
                price: true,
            }
        });
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublish: true,
            }
        });

        if(!chapter || !course){
            throw new Error("Chapter or course not found!");
        }
         let muxData = null;
         let attachments: Attachment[] = []; // it is let attachment which is type of Attachment array default is []
         let nextChapter: Chapter | null = null; // it is let nextChapter is type of Chapter or null and default is null

         // now only if the user purchase course we fetch the above
         if(purchase){
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                }
            })
         }
         if(chapter.isFree || purchase){
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                }
            });
            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublish: true,
                    position: {
                        gt: chapter?.position,
                    }
                },
                orderBy: {
                    position: "asc",
                }
            });
         }
         const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            }
         });
         return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase
         }

    } catch (error) {
        console.log("[GET_CHAPTER", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachment: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        }
    }
}