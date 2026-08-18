import prismadb from "@/lib/prismadb";
import { getCurrentYearRange } from "@/actions/get-current-year-range";

export const getSalesCount = async (storeId: string) => {
    const { startOfYear, startOfNextYear } = getCurrentYearRange();

    const salesCount = await prismadb.order.count({
        where: {
            storeId,
            isPaid: true,
            createdAt: {
                gte: startOfYear,
                lt: startOfNextYear,
            },
        },
        });

    return salesCount;
}
