import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req : NextRequest , {params} : {params :{
    productId : string
}})
{
    try{
        const {productId} = await params;
        
        if(!productId)
        {
            return new NextResponse("Product Id is reqired", {status:400});
        }
        const product = await prismadb.product.findUnique({
            where:{
                id : productId
            },
            include :{
                images : true,
                category :true,
                size : true,
                color : true,
            }
        });
        return NextResponse.json(product);
    }
    catch(error)
    {
        console.log("[PRODUCT_GET]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}

export async function PATCH(req : NextRequest , {params} : {params :{
    storeId : string,
    productId : string
}})
{
    try{
        const {userId} = await auth();
        const body = await req.json();
        const {name ,
             price ,
             categoryId,
             colorId,
             sizeId,
             images,
             isFeatured,
             isArchived
            } = body;
        const{storeId , productId} = await params;
        if(!userId)
        {
            return new NextResponse("Unauthorized" , {status:401});
        }
         if(!name)
        {
            return new NextResponse("Name is requires" , {status : 400});
        }
        if(!price)
        {
            return new NextResponse("Price is required", {status: 400});
        }
        if(!categoryId)
        {
            return new NextResponse("CategoryId is required", {status: 400});
        }
        if(!sizeId)
        {
            return new NextResponse("SizeId is required", {status: 400});
        }
         if(!colorId)
        {
            return new NextResponse("ColorId is required", {status: 400});
        }
        if(!images || !images.length)
        {
            return new NextResponse("Images are required", {status: 400});
        }
        if(!storeId)
        {
            return new NextResponse("Store id is required",{status:400});
        }
        if(!productId)
        {
            return new NextResponse("Product Id is reqired", {status:400});
        }
        const storeByUserId = await prismadb.store.findFirst(
            {
                where : {
                    id : storeId,
                    userId :userId
                }
            }
        );
        if(!storeByUserId)
        {
            return new NextResponse("Unauthorized" , {status:403})
        }
        // First, update the product fields
        const updatedProduct = await prismadb.product.updateMany({
            where: {
                id: productId
            },
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived
            }
        });

        // Then, delete existing images
        await prismadb.image.deleteMany({
            where: {
                productId: productId
            }
        });

        // Then, create new images
        await prismadb.image.createMany({
            data: images.map((image: { url: string }) => ({
                url: image.url,
                productId: productId
            }))
        });

        return NextResponse.json(updatedProduct);
    }
    catch(error)
    {
        console.log("[PRODUCT_PATCH]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}


export async function DELETE(req : NextRequest , {params} : {params :{
    productId : string
    storeId : string
}})
{
    try{
        const {userId} = await auth();
        const {productId , storeId} = await params;
        if(!userId)
        {
            return new NextResponse("Unauthorized" , {status:401});
        }
        if(!storeId)
        {
            return new NextResponse("Store Id is reqired", {status:400});
        }
        if(!productId)
        {
            return new NextResponse("Product Id is reqired", {status:400});
        }
          const storeByUserId = await prismadb.store.findFirst(
            {
                where : {
                    id : storeId,
                    userId :userId
                }
            }
        );
        if(!storeByUserId)
        {
            return new NextResponse("Unauthorized" , {status:403})
        }
        const product = await prismadb.product.deleteMany({
            where:{
                id : productId
            }
        });
        return NextResponse.json(product);
    }
    catch(error)
    {
        console.log("[PRODUCT_DELETE]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}