'use client';

import { useParams, useRouter } from "next/navigation";



import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";



interface OrderClientProps{
    data : OrderColumn[]
}
export function OrderClient(props : OrderClientProps)
{
    const router = useRouter();
    const parmas = useParams();
    return (
        <>
            <Heading title= {`Orders (${props.data.length})`}
            description="Manage Orders for your store"></Heading>
            <Separator></Separator>
            <DataTable columns={columns} data={props.data} searchKey="products"/>
        </>
    );
}