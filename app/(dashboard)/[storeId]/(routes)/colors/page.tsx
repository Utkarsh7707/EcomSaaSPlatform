import {format} from 'date-fns'
import prismadb from "@/lib/prismadb";
import { ColorClient } from "./components/client";
import { ColorColumn } from './components/columns';



export default async function ColorsPage({params} :{
    params : {
        storeId : string
    }
})
{
    const {storeId} = await params;
    const colors = await prismadb.color.findMany(
        {
            where : {
                storeId : storeId
            },
            orderBy :{
                createdAt : 'desc'
            }
        }
    );
    const formattedColors: ColorColumn[] = colors.map((item)=>(
        {
            id : item.id,
            name : item.name,
            value : item.value,
            createdAt : format(item.createdAt,"MMMM do, yyyy")
        }
    )) 
    return(
        <div className=" flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorClient data = {formattedColors}></ColorClient>
            </div>
        </div>
    );
}