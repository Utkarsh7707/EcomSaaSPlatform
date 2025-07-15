import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/Size-form";
import { Separator } from "@/components/ui/separator";

export default async function ColorPage({params} : {
    params : {
        colorId : string
    }
})
{ 
    const {colorId} =  await params;
    const color = await prismadb.color.findUnique(
        {
            where :{
                id : colorId
            }
        }
    );
    return(
        <div className="flex-1 space-y-4 pt-6 p-8">
            <ColorForm initialData={color}></ColorForm>
        </div>
    );
}