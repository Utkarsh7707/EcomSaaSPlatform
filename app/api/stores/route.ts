import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req :NextRequest)
{
    try
    {
        const body = await req.json();
        const {userId} = await auth();
        if(!userId)
        {
            return new NextResponse("Unauthenticated" , {status :401});
        }
        if(!body.name)
        {
            return new NextResponse("name is requires" , {status : 400});
        }
        const store = await prismadb.store.create({
            data :{
                userId : userId,
                name : body.name,
            }
        })
        console.log(userId);
        return NextResponse.json(store);
    }
    catch(error)
    {
        console.log('[STORES_POST]', error ,{status :500 })
        return new NextResponse("Internal Error" , {status : 500});
    }
}