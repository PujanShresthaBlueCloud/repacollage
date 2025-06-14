"use client"
import { auth } from "@clerk/nextjs/server";
import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";

import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
} from "react-icons/fc"
import { IconType } from "react-icons";

// Props in object
interface CategoresProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Music Science ": FcMusic,
    "Photography Science ": FcOldTimeCamera,
    "Fittness Science ": FcSportsMode,
    "Accounting Science ": FcSalesPerformance,
    "Computer Science ": FcMultipleDevices,
    "Filming Science ": FcFilmReel,
    "Engineering Science ": FcEngineering,
};

export const Categories = ({
    items,
}: CategoresProps)=>{
    return(
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item)=>(
                <CategoryItem 
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}