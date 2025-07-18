
import prismadb from "@/lib/prismadb";


export async function getSalesCount(storeId : string)
{
    const salesCount = await prismadb.order.count({
        where : {
            storeId : storeId,
            isPaid : true
        }
    })

   

    return salesCount;
}