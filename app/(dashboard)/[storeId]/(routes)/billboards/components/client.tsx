'use client';
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface BillBoardClientProps{
    data : BillboardColumn[]
}
export function BillboardClient(props : BillBoardClientProps)
{
    const router = useRouter();
    const parmas = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title= {`Billboards (${props.data.length})`}
                description="Manage Billboards for your store"></Heading>
                <Button onClick={()=>{router.push(`/${parmas.storeId}/billboards/new`)}}>
                    <Plus className="mr-2 h-4 w-4"/> Add new
                </Button>
            </div>
            <Separator></Separator>
            <DataTable columns={columns} data={props.data} searchKey="label"/>
            <Heading title="API" description="API calls for Billboards"></Heading>
            <Separator></Separator>
            <ApiList entityName="billboards" entityIdName="billboardId" ></ApiList>
        </>
    );
}