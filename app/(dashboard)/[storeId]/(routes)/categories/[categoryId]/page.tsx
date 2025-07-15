import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/Category-form";
import { Separator } from "@/components/ui/separator";

export default async function CategoryPage({params} : {
    params : {
        categoryId : string,
        storeId : string
    }
})
{ 
    const {categoryId , storeId} =  await params;
    const category = await prismadb.category.findUnique(
        {
            where :{
                id : categoryId
            }
        }
    );
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId : storeId
        }
    }); 
    return(
        <div className="flex-1 space-y-4 pt-6 p-8">
            <CategoryForm initialData={category} billboards={billboards} />
        </div>
    );
}