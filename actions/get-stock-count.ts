
import prismadb from "@/lib/prismadb";


export async function getProductsInStock(storeId : string)
{
    const stockCount = await prismadb.product.count({
        where : {
            storeId : storeId,
            isArchived : false
        }
    })

   

    return stockCount;
}