"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, Chapter } from "@prisma/client";
import { ChaptersList } from "./chapters-list";

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
import { Pencil, PlusCircle} from "lucide-react";
import { cn } from "@/lib/utils";

//declaring database schema getting the description attribute to be update
const formSchema = z.object({
    title: z.string().min(1)
})

interface ChaptersFormProps {
    initialData: Course & {chapters: Chapter[]}
    courseId: string;
};


//Description form component
export const ChaptersForm = ({
    initialData,
    courseId 
}:ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const toggleCreating = () => setIsCreating((current)=> !current);
    const router = useRouter();
    
    // console.log("initial data chapter ", initialData)
    //database connection for the title and getting all the initial data i.e, title
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        if (!courseId) throw new Error("courseId is required");
        try {
            console.log("values for chapter ----- ",  values)
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast("Chapter created successfully");
            toggleCreating();
            router.refresh();
        } catch(error){
            toast.error("Something went wronge while updating chapter");
            console.log("Chapter updating error", error)
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course chapter
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                            <>Cancel</>
                        ):(
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add a chapter
                            </>
                        )
                    }
                </Button>
            </div>
            <div>
                {isCreating && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                disabled={isSubmitting}
                                                placeholder="Introduction to the course"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Create
                            </Button>
                        </form>
                    </Form>
                )}
                {!isCreating && (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}>
                        {!initialData.chapters.length && "No chapter"}
                        <ChaptersList
                            onEdit={() => {}}
                            onReorder={() => {}}
                            items={initialData.chapters || []}
                        />
                    </p>
                )}
                {!isCreating && (
                    <p className="text-xs text-muted-forground mt-4">
                        Drag and drop to reorder chapters
                    </p>
                )}
            </div>
        </div>
    )
} // end of component


