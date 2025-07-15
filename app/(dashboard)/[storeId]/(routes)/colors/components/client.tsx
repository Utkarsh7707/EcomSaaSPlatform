'use client';
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface ColorClientProps{
    data : ColorColumn[]
}
export function ColorClient(props : ColorClientProps)
{
    const router = useRouter();
    const parmas = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title= {`Colors (${props.data.length})`}
                description="Manage Colors for your store"></Heading>
                <Button onClick={()=>{router.push(`/${parmas.storeId}/colors/new`)}}>
                    <Plus className="mr-2 h-4 w-4"/> Add new
                </Button>
            </div>
            <Separator></Separator>
            <DataTable columns={columns} data={props.data} searchKey="name"/>
            <Heading title="API" description="API calls for Colors"></Heading>
            <Separator></Separator>
            <ApiList entityName="colors" entityIdName="colorId" ></ApiList>
        </>
    );
}