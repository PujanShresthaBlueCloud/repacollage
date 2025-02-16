"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

//declaring database schema getting the description attribute to be update
const formSchema = z.object({
    categoryId: z.string().min(1)
})

interface CategoryFormProps {
    initialData: Course
    courseId: string;
    options: {label: string; value: string}[]
};


//Description form component
export const CategoryForm = ({
    initialData,
    courseId,
    options,
}:CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current)=> !current);
    const router = useRouter();

    //database connection for the description and getting all the initial data i.e, description
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        }
    })
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        if (!courseId) throw new Error("courseId is required");
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast("Course update successfully");
            toggleEdit();
            router.refresh();
        } catch(error){
            toast.error("Something went wronge while updating description");
            console.log("Description updating error", error)
        }
    }
    const selectedOption = options.find((option) => option.value === initialData.categoryId);
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course category
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                            <>Cancel</>
                        ):(
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit category
                            </>
                        )
                    }
                </Button>
            </div>
            <div>
                {!isEditing && (
                    <p className={cn(
                        "text-sm -2",
                        !initialData.categoryId && "text-slate-500 italic"
                    )}>
                        {selectedOption?.label ||  "No category availble"}
                    </p>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <Combobox options={...options} {...field}/>
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


