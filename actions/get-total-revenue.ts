import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
    }});

    // TODO: Quantity is not yet implemented
    const totalRevenue = paidOrders.reduce((total, order) => {
        return total + order.orderItems.reduce((total, item) => {
            return total + item.product.price.toNumber();
            //  * item.quantity.toNumber();
        }, 0);
    }, 0);

    return totalRevenue;
}