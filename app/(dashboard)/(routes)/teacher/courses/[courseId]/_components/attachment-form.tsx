"use client";
import * as z from "zod";
import axios from "axios";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle, File, DeleteIcon, Delete, Loader2, X } from "lucide-react";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Attachment } from "@prisma/client";
import Image from "next/image";

//declaring database schema getting the description attribute to be update
const formSchema = z.object({
    url: z.string().min(1, {
        message: "Url is required",
    })
})

interface AttachmentFormProps {
    initialData: Course & {attachments: Attachment[]}
    courseId: string;

};


//Description form component
export const AttachmentForm = ({
    initialData,
    courseId 
}:AttachmentFormProps) => {
    // console.log("initial data of attachment ", initialData)
    // console.log("course id ", courseId)
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const toggleEdit = () => setIsEditing((current)=> !current);
    const router = useRouter();
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        if (!courseId) throw new Error("courseId is required");
        try {
            console.log("Values ", values)
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast("Course update successfully");
            toggleEdit();
            router.refresh();
        } catch(error){
            // console.error("URL updating error", error.response?.data || error.message);
            console.error(error)
            toast.error("Something went wrong while updating attachment");
        }
    }
    const onDelete = async (id: string) => {
        // console.log(" attachment Id ", id)
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted")
            router.refresh()
        } catch {
            toast.error("Something went wrong")
        } finally {
            setDeletingId(null);
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                                Add a file
                        </>
                    )}
                </Button>
            </div>
            <div>
                {!isEditing && (
                  <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm text-slate-500 italic">
                            No attachment yet
                        </p>
                    )}
                    {initialData.attachments.length > 0  && (
                        <div className="space--2">
                            {initialData.attachments.map((attachment) =>(
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md" >

                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p>
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <div>
                                            <button 
                                                onClick={() => onDelete(attachment.id)}
                                                className="ml-auto hover:opacity-75 transitiob"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                   
                                </div>
                            ))}
                        </div>
                    )}                  
                  </>
                )}
                {isEditing && (
                    <div>
                        <FileUpload
                            endpoint="courseAttachment"
                            onChange={(url)=> {
                                if(url){
                                    onSubmit({url: url})
                                }
                            }}
                        />
                        <div className="text-ts text-muted-foreground mt-4">
                            Add anything your student might need to complete the course
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} // end of component


