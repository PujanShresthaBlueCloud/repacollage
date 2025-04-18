"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// importing all from component form
import {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";


//declaring database schema
const formSchema = z.object({
    title: z.string().min(1)
})

interface ChapterTitleFormProps {
    initialData: {
        title: string,
    };
    courseId: string;
    chapterId: string;
};

export const ChapterTitleForm = ({
    initialData, 
    courseId,
    chapterId,
}: ChapterTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();

    // Using formSchema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
            console.log("Course title error:", error)
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter title
                <Button onClick={toggleEdit} variant="ghost" >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                </Button>
            </div> 
            <div>
                {!isEditing && (
                        <p className="text-sm -2">
                            {initialData.title}
                        </p>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} 
                            className="space-y-4 mt-4"
                        >
                            <FormField 
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                disabled={isSubmitting}
                                                placeholder="e.g. Introduction to the course"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex item-center gap-x-2">
                                <Button disabled={!isValid || isSubmitting} type="submit">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}    
            </div> 
        </div>
    )
};