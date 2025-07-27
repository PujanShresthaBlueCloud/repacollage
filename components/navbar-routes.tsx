"use client"

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link  from 'next/link';
import { SearchInput } from "./search-input";


export const NavbarRoutes = () => {
    const pathname = usePathname() // we use hook
    const routes = useRouter() // we use hook

    // Using isTeacherPage and isCoursePage to router according to the page
    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";
    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePage ?(
                    <Link href="/">
                        <Button size="sm" variant="ghost">
                            <LogOut/>
                            Exit
                        </Button>
                    </Link>
                ): (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher mode
                        </Button>
                    </Link>

                )}
                <UserButton 
                afterSwitchSessionUrl="/"
                />
            </div>
        </>
    )
}