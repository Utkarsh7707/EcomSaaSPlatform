import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/Product-form";

export default async function ProductPage({params} : {
    params : {
        productId : string
        storeId :string
    }
})
{ 
    const {productId , storeId} =  await params;
    const product = await prismadb.product.findUnique(
        {
            where :{
                id : productId
            },
            include :{
                images : true
            }
        }
    )
    
    // Convert Decimal to number to make it serializable
    const serializedProduct = product ? {
        ...product,
        price: product.price.toNumber() // Convert Decimal to number
    } : null;
    
    const categories = await prismadb.category.findMany({
        where: {
            storeId : storeId
        }
    });
    const sizes = await prismadb.size.findMany({
        where: {
            storeId : storeId
        }
    });
     const colors = await prismadb.color.findMany({
        where: {
            storeId : storeId
        }
    })
    return(
        <div className="flex-1 space-y-4 pt-6 p-8">
            <ProductForm 
            categories = {categories}
            sizes = { sizes}
            colors = {colors}
            initialData={serializedProduct} ></ProductForm>
        </div>
    );
}