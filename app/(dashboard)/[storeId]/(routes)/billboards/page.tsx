import {format} from 'date-fns'
import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from './components/columns';



export default async function BillboardsPage({params} :{
    params : {
        storeId : string
    }
})
{
    const {storeId} = await params;
    const billboards = await prismadb.billboard.findMany(
        {
            where : {
                storeId : storeId
            },
            orderBy :{
                createdAt : 'desc'
            }
        }
    );
    const formattedBillboards: BillboardColumn[] = billboards.map((item)=>(
        {
            id : item.id,
            label : item.label,
            createdAt : format(item.createdAt,"MMMM do, yyyy")
        }
    )) 
    return(
        <div className=" flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data = {formattedBillboards}></BillboardClient>
            </div>
        </div>
    );
}