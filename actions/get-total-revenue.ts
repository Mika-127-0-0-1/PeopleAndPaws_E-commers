import prismadb from "@/lib/prismadb";
import { getCurrentYearRange } from "@/actions/get-current-year-range";
import { Prisma } from "@prisma/client";

type PaidOrder = Prisma.OrderGetPayload<{
    include: {
        orderItems: {
            include: {
                product: true;
            };
        };
    };
}>;

type PaidOrderItem = PaidOrder["orderItems"][number];

export const getTotalRevenue = async (storeId: string): Promise<number> => {
    const { startOfYear, startOfNextYear } = getCurrentYearRange();

    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
            createdAt: {
                gte: startOfYear,
                lt: startOfNextYear,
            },
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    const totalRevenue = paidOrders.reduce<number>((total: number, order: PaidOrder) => {
        return total + order.orderItems.reduce<number>((orderTotal: number, item: PaidOrderItem) => {
            return orderTotal + (item.product.price.toNumber() * item.quantity);
        }, 0);
    }, 0);

    return totalRevenue;
};
