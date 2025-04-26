"use client"

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({row})=>{
        const price = parseFloat(row.getValue("price") || "0");
        const formatted = new Intl.NumberFormat("ne-NP", {
            style: "currency",
            currency: "NPR"
        }).format(price);
        return(
            <div>
                {formatted}
            </div>
        )
    }
  },
  {
    accessorKey: "isPublish",
    header: ({ column }) => {
        return (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Published
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({row})=>{
        const isPublish = row.getValue("isPublish") || false;
        return(
            <Badge className={cn(
                "bg-slate-500",
                isPublish && "bg-sky-700"
            )}>
                {isPublish && "Published" || "Draft"}
            </Badge>
        )
    }
  },
  {
    id: "actions",
    cell: ({row})=>{
        const {id}=row.original; // id is the course id here
        return(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-4 w-8 p-0">
                        <span className="sr-only">
                            Open menu
                        </span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/teacher/courses/${id}`}>
                        <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-4"/>
                            Edit
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
]
