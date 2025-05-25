import { Category, Course } from "@prisma/client";

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
            {items.map((item)=>
                <div key={item.id}>
                    {item.title}
                </div>
            )}
        </div>
    )
}