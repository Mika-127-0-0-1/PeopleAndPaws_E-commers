import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: {storeId: string, ordersId: number } }
){
    try{
        const { userId } = auth();
        const body = await req.json();

        const { shippingPrice } = body;
        console.log("Params received:", params);

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
        console.log(shippingPrice);
        if (shippingPrice === null || shippingPrice < 0) {
            return new NextResponse("shippingPrice is required", {status: 400});
        }
        if (!params.ordersId) {
            return new NextResponse("Invoice number is required", {status: 400});
        }

        const storeByUserID = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserID) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const order = await prismadb.order.update({
            where: {
                orderNumber: Number(params.ordersId),
            },
            data: {
                shippingPrice: shippingPrice
            }
        });

        return NextResponse.json(order);

    } catch (error){
        console.log('[ORDER_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}