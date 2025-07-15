import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";

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
        const {label , imageUrl} = body;
        // const {storeId} = await params;
        if(!label)
        {
            return new NextResponse("label is requires" , {status : 400});
        }
        if(!imageUrl)
        {
            return new NextResponse("Image url is required", {status: 400});
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
        const billboard = await prismadb.billboard.create({
            data :{
                label : label,
                imageUrl : imageUrl,
                storeId : storeId
            }
        })
        // console.log(userId);
        return NextResponse.json(billboard);
    }
    catch(error)
    {
        console.log('[BILLBOARDS_POST]', error ,{status :500 })
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
       
      
        const billboards = await prismadb.billboard.findMany({
            where :{
                storeId : storeId
            }
        });
        // console.log(userId);
        return NextResponse.json(billboards);
    }
    catch(error)
    {
        console.log('[BILLBOARDS_GET]', error ,{status :500 })
        return new NextResponse("Internal Error" , {status : 500});
    }
}