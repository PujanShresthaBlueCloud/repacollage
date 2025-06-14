"use client"
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import qs from "query-string";



import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { skip } from "node:test";

export const SearchInput = ()=>{
    const [value, setValue] = useState("");

    // value from useState is passed to useDebounce() hook
    const debouncedValue = useDebounce(value);

    const searchParams = useSearchParams();
    const router =  useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(()=>{
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue
            }
        }, {skipEmptyString: true, skipNull: true });
        router.push(url);
    },[debouncedValue, currentCategoryId, router, pathname]); // array here is called interdependency array

    return(
        <div className="relative">
            <Search 
                className="h-4 w-4 absolute top-3 left-3 text-slate-600"
            />
            <Input
                onChange={(e)=>setValue(e.target.value)}
                value={value}
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                placeholder="Search for a course"
            />
        </div>
    )
}