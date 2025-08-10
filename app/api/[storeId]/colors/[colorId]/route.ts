import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req : NextRequest , {params} : {params : Promise<{
    colorId : string
}>})
{
    try{
        const {colorId } = await params;
        
        if(!colorId)
        {
            return new NextResponse("Size Id is reqired", {status:400});
        }
        const color = await prismadb.color.findUnique({
            where:{
                id : colorId
            }
        });
        return NextResponse.json(color);
    }
    catch(error)
    {
        console.log("[COLOR_GET]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}

export async function PATCH(req : NextRequest , {params} : {params :Promise<{
    storeId : string,
    colorId : string
}>})
{
    try{
        const {userId} = await auth();
        const body = await req.json();
        const {name , value} = body;
        const{storeId , colorId} = await params;
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
        if(!colorId)
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
        const color = await prismadb.color.updateMany({
            where :{
                id : colorId
            },
            data :{
                name : name,
                value : value
            }
        });
        return NextResponse.json(color);
    }
    catch(error)
    {
        console.log("[COLOR_PATCH]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}


export async function DELETE(req : NextRequest , {params} : {params :Promise<{
    colorId : string
    storeId : string
}>})
{
    try{
        const {userId} = await auth();
        const {colorId , storeId} = await params;
        if(!userId)
        {
            return new NextResponse("Unauthorized" , {status:401});
        }
        if(!storeId)
        {
            return new NextResponse("Store Id is reqired", {status:400});
        }
        if(!colorId)
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
        const color = await prismadb.color.deleteMany({
            where:{
                id : colorId
            }
        });
        return NextResponse.json(color);
    }
    catch(error)
    {
        console.log("[COLOR_DELETE]",error);
        return new NextResponse("Internal error ",{status :500});
    }
}