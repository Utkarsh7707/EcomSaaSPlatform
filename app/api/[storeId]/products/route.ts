import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";
import { string } from "zod";

export async function POST(req :NextRequest, {params} : {
    params : {
        storeId : string
    } })
{
    try
    {
        const body = await req.json();
        const {userId} = await auth();
        const {storeId} = await params;
        if(!userId)
        {
            return new NextResponse("Unauthenticated" , {status :401});
        }
        const {name ,
             price ,
             categoryId,
             colorId,
             sizeId,
             images,
             isFeatured,
             isArchived
            } = body;
        // const {storeId} = await params;
        console.log(body)
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
            return new NextResponse("storeId is requires" , {status : 400});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where : {
                id : storeId,
                userId : userId
            }
        });
        if(!storeByUserId)
        {
            return new NextResponse("Unauthorized !", {status :403});
        }
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                colorId,
                storeId,
            }
            });

            // 2. Create images separately, linking them to the product
            await prismadb.image.createMany({
            data: images.map((image: { url: string }) => ({
                url: image.url,
                productId: product.id,
            }))
            });
        // console.log(userId);
        return NextResponse.json(product);
    }
    catch(error)
    {
        console.log('[PRODUCTS_POST]', error ,{status :500 })
        return new NextResponse("Internal Error" , {status : 500});
    }
}


export async function GET(req :NextRequest, {params} : {
    params : {
        storeId : string
    }
})
{
    try
    {
        // const {userId} = await auth();
        // if(!userId)
        // {
        //     return new NextResponse("Unauthenticated" , {status :401});
        // }
        const {storeId} = await params;
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");
        const products = await prismadb.product.findMany({
            where :{
                storeId : storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured : isFeatured ? true : undefined,
                isArchived : false
            },
            include: {
                images : true,
                category : true,
                color : true,
                size : true

            },
            orderBy : {
                createdAt : 'desc'
            }
        });
        // console.log(userId);
        return NextResponse.json(products);
    }
    catch(error)
    {
        console.log('[PRODUCTS_GET]', error ,{status :500 })
        return new NextResponse("Internal Error" , {status : 500});
    }
}