import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prismadb from "@/lib/prismadb";

// Utility function to add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'false'); // or omit this
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}
export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}
// Handle preflight requests
// export async function OPTIONS(req: NextRequest) {
//   const response = NextResponse.json({}, { status: 200 });
//   return addCorsHeaders(response);
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    } = await body;

    if (!order_id) {
      return addCorsHeaders(
        NextResponse.json("Order id is required", { status: 400 }),
        
      );
    }
    if (!razorpayPaymentId) {
      return addCorsHeaders(
        NextResponse.json("Razorpay paymentId is required", { status: 400 }),
        
      );
    }
    if (!razorpayOrderId) {
      return addCorsHeaders(
        NextResponse.json("Razorpay OrderId is required", { status: 400 }),

      );
    }
    if (!razorpaySignature) {
      return addCorsHeaders(
        NextResponse.json("Razorpay Signature is required", { status: 400 }),
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_ID!)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return addCorsHeaders(
        NextResponse.json(
          { error: "Payment verification failed" },
          { status: 400 }
        ),
      );
    }

    // if payment is verified now update 
    // the order isPaid = true

    const updatedOrder = await prismadb.order.update({
      where: {
        id: order_id
      },
      data: {
        isPaid: true
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    return addCorsHeaders(
      NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        order: updatedOrder
      })
    );
  } catch (error) {
    console.error("[PAYMENT_VERIFY_ERROR]", error);
    return addCorsHeaders(
      NextResponse.json({ error: "Payment verification error" }, { status: 500 }),
    );
  }
}
