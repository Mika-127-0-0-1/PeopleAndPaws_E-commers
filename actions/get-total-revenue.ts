import prismadb from "@/lib/prismadb";
import { getCurrentYearRange } from "@/actions/get-current-year-range";

export const getTotalRevenue = async (storeId: string) => {
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
    }});

    const totalRevenue = paidOrders.reduce((total, order) => {
        return total + order.orderItems.reduce((total, item) => {
            return total + (item.product.price.toNumber() * item.quantity);
        }, 0);
    }, 0);

    return totalRevenue;
}
