import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { IconBadge } from "@/components/icon-badge";
import { CircleDollarSign, File, LayoutDashboard, ListCheck } from "lucide-react";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";

// when inside the large bracket [courseId] we can assess the courseId automaticaly
// params to get the course attributes
const CourseIdPage = async ({ params }: { params: {courseId: string}}) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc"
                },
            },
        },
    });
    const categories = await db.category.findMany({
        orderBy:{
            name: "asc",
        },
    });

    if (!course) {
        return redirect("/");
    }

    // check list of all the fields from the database course table to publish the course
    const requiredFields = [
        course.title,
        course.description,
        course.imageURL,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublish),
    ]
    // total fields 
    const totalFields = requiredFields.length;
    // so for the null value of the attributes to the course it will not give the length
    const completedFields =  requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);
    return (
        <>
            {!course.isPublish && (
                <Banner
                    label="This course is unpublish. It will not be visible to the students."
                />
            )}
            <div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Course Setup
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        {/* Add action */}
                        <Actions 
                            disabled={!isComplete}
                            courseId={params.courseId}
                            isPublish={course.isPublish}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your course
                                </h2>
                            </div>
                            <div>
                                <TitleForm initialData={course} courseId={course.id}/>
                            </div>
                            <div>
                                <DescriptionForm initialData={course} courseId={course.id}/>
                            </div>
                            <div>
                                <ImageForm initialData={course} courseId={course.id}/>
                            </div>
                            <div>
                                <CategoryForm 
                                    initialData={course} 
                                    courseId={course.id}
                                    options={categories.map((category) => ({
                                        label: category.name,
                                        value: category.id,
                                    }))}   
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={ListCheck}/>
                                    <h2 className="text-xl">
                                        Course chapters
                                    </h2>
                                </div>
                                <div>
                                    <ChaptersForm initialData={course} courseId={course.id}/>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={CircleDollarSign} />
                                    <h2 className="text-xl">
                                        Sell your course
                                    </h2>
                                </div>
                                <PriceForm
                                    initialData={course}
                                    courseId={course.id}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={File} />
                                    <h2 className="text-xl">
                                        Resources & attachments
                                    </h2>
                                </div>
                                <div>
                                    <AttachmentForm initialData={course} courseId={course.id}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CourseIdPage;