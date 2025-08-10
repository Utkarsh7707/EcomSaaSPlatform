import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/Size-form";
import { Separator } from "@/components/ui/separator";

export default async function SizePage({params} : {
    params : Promise<{
        sizeId : string
    }>
})
{ 
    const {sizeId} =  await params;
    const size = await prismadb.size.findUnique(
        {
            where :{
                id : sizeId
            }
        }
    );
    return(
        <div className="flex-1 space-y-4 pt-6 p-8">
            <SizeForm initialData={size}></SizeForm>
        </div>
    );
}