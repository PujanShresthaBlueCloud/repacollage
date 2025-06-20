import { db } from "@/lib/db";

export const getProgress = async (
    userId: string,
    courseId: string,
) : Promise<number>=>{
    try{
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublish: true,
            },
            select: {
                id: true,
            }
        });
        const publishedChaptersIds = publishedChapters.map((chapter)=>chapter.id);
        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChapters,
                },
                isCompleted: true,
            }
        });
        const progressPercentage = (validCompletedChapters/publishedChapters.length) * 100;


    }catch(error){
        console.log("[GET_PROGRESS", error);
        return 0;
    }
}