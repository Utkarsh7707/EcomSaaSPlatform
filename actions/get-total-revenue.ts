import prismadb from "@/lib/prismadb";
import { Order, OrderItem, Product } from "@prisma/client";

type OrderWithItems = Order & {
    orderItems: (OrderItem & {
        product: Product;
    })[];
};

export async function getTotalRevenue(storeId: string): Promise<number> {
    const paidOrders: OrderWithItems[] = await prismadb.order.findMany({
        where: {
            storeId: storeId,
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

    const totalRevenue: number = paidOrders.reduce((total: number, order: OrderWithItems) => {
        const orderTotal: number = order.orderItems.reduce((orderSum: number, item) => {
            return orderSum + item.product.price.toNumber();
        }, 0);
        return total + orderTotal;
    }, 0);

    return totalRevenue;
}