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
        const {name , billboardId} = body;
        // const {storeId} = await params;
        if(!name)
        {
            return new NextResponse("name is requires" , {status : 400});
        }
        if(!billboardId)
        {
            return new NextResponse("Billboard Id is required !", {status :400});
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
        const category = await prismadb.category.create({
            data :{
                name : name,
                billboardId : billboardId,
                storeId : storeId
            }
        })
        // console.log(userId);
        return NextResponse.json(category);
    }
    catch(error)
    {
        console.log('[CATEGORY_POST]', error ,{status :500 })
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
       
      
        const categories = await prismadb.category.findMany({
            where :{
                storeId : storeId
            }
        });
        // console.log(userId);
        return NextResponse.json(categories);
    }
    catch(error)
    {
        console.log('[CATEGORIES_GET]', error ,{status :500 })
        return new NextResponse("Internal Error" , {status : 500});
    }
}