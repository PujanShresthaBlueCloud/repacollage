"use client";

import axios from "axios";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps{
    courseId: string;
    price: number;
}

export const CourseEnrollButton = ({
    courseId,
    price,
}: CourseEnrollButtonProps) =>{
    const [isLoading, setIsLoading] = useState(false);
    const onClick = async ()=>{
        try {
            console.log("inside try")
            setIsLoading(true);
            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            console.log(response)
            window.location.assign(response.data.url);

        } catch(error) {
            console.log("checkout error --", error);
            toast.error("Something wrong in enrolling course");
        } finally{
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading} 
            className="w-full md:w-auto" 
            size="sm"
        >
            Enroll for {formatPrice(price)}
        </Button>
    )
}