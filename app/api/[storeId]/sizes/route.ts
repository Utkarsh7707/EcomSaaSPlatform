import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req :NextRequest, {params} : {
    params :Promise< {
        storeId : string
    }>})
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
        const {name , value} = body;
        // const {storeId} = await params;
        if(! name)
        {
            return new NextResponse("Name is requires" , {status : 400});
        }
        if(!value)
        {
            return new NextResponse("Value is required", {status: 400});
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
        const size = await prismadb.size.create({
            data :{
                name : name,
                value : value,
                storeId : storeId
            }
        })
        // console.log(userId);
        return NextResponse.json(size);
    }
    catch(error)
    {
        console.log('[SIZES_POST]', error ,{status :500 })
        return new NextResponse("Internal Error" , {status : 500});
    }
}


export async function GET(req :NextRequest, {params} : {
    params : Promise<{
        storeId : string
    }>
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
       
      
        const sizes = await prismadb.size.findMany({
            where :{
                storeId : storeId
            }
        });
        // console.log(userId);
        return NextResponse.json(sizes);
    }
    catch(error)
    {
        console.log('[SIZES_GET]', error ,{status :500 })
        return new NextResponse("Internal Error" , {status : 500});
    }
}