import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string, checkoutId: string } }
){
    try{
        const invoiceNumber = Number(params.checkoutId);

        if(!invoiceNumber) {
            return new NextResponse("Invoice number is required", {status: 400});
        }

        const order = await prismadb.order.findFirst({
            where: {
                orderNumber: invoiceNumber,
                storeId: params.storeId,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(order);

    } catch (error){
        console.log('[ORDER_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: {storeId: string, invNumber: number } }
){
    try{
        const { userId } = auth();
        const body = await req.json();

        // console.log(body);
        const { isPaid, invNumber } = body;
        // console.log(isPaid);
        // console.log(invNumber);


        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if (!isPaid=== null) {
            return new NextResponse("Paid? is required", {status: 400});
        }
        if (!invNumber=== null) {
            return new NextResponse("Invoice number is required", {status: 400});
        }

        // console.log(params.invNum);
        // if(!params.invNum) {
        //     return new NextResponse("Invoice number is required", {status: 400});
        // }

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
                orderNumber: invNumber,
            },
            data: {
                isPaid: !isPaid
            }
        });

        return NextResponse.json(order);

    } catch (error){
        console.log('[ORDER_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: {storeId: string, checkoutId: number} } // Have to be second argument
){
    try{
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        // console.log("Params received:", params);
        const invNum = Number(params.checkoutId);
        if (!invNum) {
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

        // Step 1: Delete associated OrderItems
        // Extract orderItemId from query params
        const { searchParams } = new URL(req.url);
        const orderItemId = searchParams.get("orderItemId");

        if (!orderItemId) {
            return new NextResponse("Order item ID is required", { status: 400 });
        }
        console.log("Deleting Order Item ID:", orderItemId);

        await prismadb.orderItem.deleteMany({
            where: { orderId: orderItemId },
        });

        const order = await prismadb.order.delete({
            where: {
                orderNumber: invNum,
            }
        });

        return NextResponse.json(order);

    } catch (error){
        console.log('[ORDER_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}
