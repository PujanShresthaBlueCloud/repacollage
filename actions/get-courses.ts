import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id: string}[];
    progress: number | null;
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => { // so we expect the promise to be return of course with progress with category array
    try{
        const courses = await db.course.findMany({
            where: {
                isPublish: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublish: true,
                    },
                    select: {
                        id: true,
                    }
                },
                purchases: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const courseWithProgress : CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if(course.purchases.length === 0){
                    return {
                        // we spread course variable like this ...course
                        ...course, 
                        progress: null,
                    }
                }
                const progressPercentage = await getProgress(userId, course.id);
                return {
                    ...course,
                    progress: progressPercentage,
                };
            })
        )

        return courseWithProgress;

    }catch(error){
        console.log("[GET_COURSES]", error);
        return [];
    }
}