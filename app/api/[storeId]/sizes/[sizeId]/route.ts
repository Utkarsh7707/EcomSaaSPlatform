import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req : NextRequest , {params} : {params :Promise<{
    sizeId : string
}>})
{
    try{
        const {sizeId } = await params;
        
        if(!sizeId)
        {
            return new NextResponse("Size Id is reqired", {status:400});
        }
        const size = await prismadb.size.findUnique({
            where:{
                id : sizeId
            }
        });
        return NextResponse.json(size);
    }
    catch(error)
    {
        console.log("[SIZE_GET]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}

export async function PATCH(req : NextRequest , {params} : {params :Promise<{
    storeId : string,
    sizeId : string
}>})
{
    try{
        const {userId} = await auth();
        const body = await req.json();
        const {name , value} = body;
        const{storeId , sizeId} = await params;
        if(!userId)
        {
            return new NextResponse("Unauthorized" , {status:401});
        }
        if(!name)
        {
            return new NextResponse("Name is required" ,{status:400});
        }
        if(!value)
        {
            return new NextResponse("Value is required" ,{status:400});
        }
        if(!storeId)
        {
            return new NextResponse("Store id is required",{status:400});
        }
        if(!sizeId)
        {
            return new NextResponse("Size Id is reqired", {status:400});
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
        const size = await prismadb.size.updateMany({
            where :{
                id : sizeId
            },
            data :{
                name : name,
                value : value
            }
        });
        return NextResponse.json(size);
    }
    catch(error)
    {
        console.log("[SIZE_PATCH]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}


export async function DELETE(req : NextRequest , {params} : {params :Promise<{
    sizeId : string
    storeId : string
}>})
{
    try{
        const {userId} = await auth();
        const {sizeId , storeId} = await params;
        if(!userId)
        {
            return new NextResponse("Unauthorized" , {status:401});
        }
        if(!storeId)
        {
            return new NextResponse("Store Id is reqired", {status:400});
        }
        if(!sizeId)
        {
            return new NextResponse("Size Id is reqired", {status:400});
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
        const size = await prismadb.size.deleteMany({
            where:{
                id : sizeId
            }
        });
        return NextResponse.json(size);
    }
    catch(error)
    {
        console.log("[SIZE_DELETE]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}