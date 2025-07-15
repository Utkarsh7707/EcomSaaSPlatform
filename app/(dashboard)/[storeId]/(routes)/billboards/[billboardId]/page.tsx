import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/Billboard-form";
import { Separator } from "@/components/ui/separator";

export default async function BillBoardPage({params} : {
    params : {
        billboardId : string
    }
})
{ 
    const {billboardId} =  await params;
    const billboard = await prismadb.billboard.findUnique(
        {
            where :{
                id : billboardId
            }
        }
    );
    return(
        <div className="flex-1 space-y-4 pt-6 p-8">
            <BillboardForm initialData={billboard}></BillboardForm>
        </div>
    );
}