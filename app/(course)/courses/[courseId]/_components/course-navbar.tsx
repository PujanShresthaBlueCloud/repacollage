import { NavbarRoutes } from "@/components/navbar-routes";
import { Course, Chapter, UserProgress } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";


interface CourseNavbarProps{
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]; // the array is to put all the chapter that is in array
    }
    progressCount: number;
}
export const CourseNavbar=({
    course,
    progressCount
}:CourseNavbarProps)=>{

    return(
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar 
                course={course}
                progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    )
}