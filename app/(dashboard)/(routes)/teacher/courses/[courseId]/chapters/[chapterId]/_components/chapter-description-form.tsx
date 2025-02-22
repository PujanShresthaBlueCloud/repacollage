"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter} from "@prisma/client";

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
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

//declaring database schema getting the description attribute to be update
const formSchema = z.object({
    description: z.string().min(1)
})

interface ChapterDescriptionFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
};


//Description form component
export const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId,
}:ChapterDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current)=> !current);
    const router = useRouter();

    //database connection for the description and getting all the initial data i.e, description
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    })
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        if (!courseId) throw new Error("courseId is required");
        try {
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter update successfully");
            toggleEdit();
            router.refresh();
        } catch(error){
            toast.error("Something went wronge while updating  chapter description");
            console.log("Description updating error", error)
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                            <>Cancel</>
                        ):(
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit description
                            </>
                        )
                    }
                </Button>
            </div>
            <div>
                {!isEditing && (
                    <div className={cn(
                        "text-sm -2",
                        !initialData.description && "text-slate-500 italic"
                    )}>
                        {!initialData.description && "No description availble"}
                        {initialData && 
                            <Preview 
                                value={initialData.description}
                            />
                        }
                    </div>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <Editor 
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
} // end of component