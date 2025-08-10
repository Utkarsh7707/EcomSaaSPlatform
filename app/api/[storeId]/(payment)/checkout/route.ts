import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";


const razorpay = new Razorpay(
    {
        key_id : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret : process.env.RAZORPAY_SECRET_ID
    }
);

// CORS helper function
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'false'); // or omit this
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}
export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}
// // Handle preflight OPTIONS request (required for CORS)
// export async function OPTIONS(request: NextRequest) {
//   return addCorsHeaders(new NextResponse(null, { status: 200 }));
// }


export async function POST( req : NextRequest,{params} :{params : {
    storeId : string
} } )
{
    try{

    const body = await req.json();
    const {productIds , customerAddress, customerPhone} = body;
    const {storeId} = await params;
    
    if(!storeId)
    {
        return NextResponse.json("Store Id is required ", {status : 400});
    }
    if(!productIds || productIds.length === 0 || !Array.isArray(productIds))
    {
        return NextResponse.json("Product Ids are required", {status : 400})
    }
    if(!customerAddress)
    {
        return NextResponse.json("Customer Email is required !", {status :400});
    }
    if(! customerPhone)
    {
        return NextResponse.json("Customer Phone is required !", {status :400});
    }
    const products = await prismadb.product.findMany({
        where :{
            id :{
                in : productIds
            }
        }
    });
    
    if(products.length !== productIds.length )
    {
        return NextResponse.json("Some products are not found", {status :400});
    }

    const totalAmount = products.reduce((total , item) => {
        return total + Number(item.price);
    },0);

    //creating razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount : totalAmount *100,
        currency : "INR",
        receipt : `order_${Date.now()}`,
        payment_capture : true,
    });

    // it will return a object  like this
        //     {
        // "id": "order_HKx8SyGJMFVqf1",
        // "entity": "order",
        // "amount": 50000,
        // "amount_paid": 0,
        // "amount_due": 50000,
        // "currency": "INR",
        // "receipt": "order_rcptid_11",
        // "offer_id": null,
        // "status": "created",
        // "attempts": 0,
        // "notes": {
        //     "shipping_address": "123, MG Road, Bangalore",
        //     "billing_address": "456, Church Street, Bangalore"
        // },
        // "created_at": 1608280957
        // }


        //creating order in database


        const order = await prismadb.order.create({
            data :{
                storeId : storeId,
                isPaid : false,
                phone : customerPhone,
                address : customerAddress,
                orderItems : {
                    create : productIds.map((productId :string) => ({
                        productId
                    }))
                }
            },
            include : {
                orderItems : {
                    include : {
                        product : true
                    }
                },
                store : true
            }
        });

        const successResponse = NextResponse.json({
            success: true,
            order,
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
            }
        });

        return addCorsHeaders(successResponse);

    }
    catch(error)
    {
        console.error("[CHECKOUT_POST]", error);
            const errorResponse = NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
    
    // Add CORS headers to error response too
    return addCorsHeaders(errorResponse);
    }


} 



// export function POST()
// {
//     return NextResponse.json({
//         message :"hii"
//     });
// }