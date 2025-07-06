import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id: string; }[]; // here {}[] denotes the array of object
    progress: number | null; 
};

interface CoursesListProps{
    items: CourseWithProgressWithCategory[] // denotes array of object
}
export const CoursesList = ({
items
}: CoursesListProps)=>{
    return (
        <div>
            <div>
                {items.map((item)=>
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageURL!}
                        chaptersLength={item.chapters.length}
                        price={item.price!}
                        progress={item.progress}
                        category={item?.category?.name!}
                    />
                )}
            </div>
            {items.length === 0 &&(
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No Course found.
                </div>
            )}
        </div>
    )
}