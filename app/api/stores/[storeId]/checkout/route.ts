import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
  
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

export async function OPTIONS(){
    return new NextResponse(null, {headers: corsHeaders});
}

export async function POST(
    req: Request,
    { params }: { params: {storeId: string } }
){
    const { orderItems, contactData } = await req.json();

    if(!Array.isArray(orderItems) || orderItems.length === 0){
        return new NextResponse("Order items are required", {status: 400});
    }

    if(!contactData){
        return new NextResponse("Contact data is required", {status: 400});
    }

    const invalidOrderItem = orderItems.some((item: unknown) => {
        if (!item || typeof item !== "object") {
            return true;
        }

        const { productId, quantity } = item as {
            productId?: unknown;
            quantity?: unknown;
        };

        return (
            typeof productId !== "string" ||
            !Number.isInteger(quantity) ||
            Number(quantity) < 1 ||
            Number(quantity) > 99
        );
    });

    if (invalidOrderItem) {
        return new NextResponse(
            "Each order item requires a productId and a quantity from 1 to 99",
            { status: 400 }
        );
    }

    const productIds = orderItems.map((item: { productId: string }) => item.productId);
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId,
            id: {
                in: productIds
            }
        },
        select: {
            id: true,
        },
    });

    if (products.length !== new Set(productIds).size) {
        return new NextResponse("One or more products are invalid", { status: 400 });
    }

    const addressComponents = [
        contactData.flatNO,
        contactData.streetAddress,
        contactData.city,
        contactData.suburb,
        contactData.province,
        contactData.country,
        contactData.postal
    ];

    const addressString = addressComponents.filter(Boolean).join(", ");

    const shipAddressComponents = [
        contactData.SHflatNO,
        contactData.SHstreetAddress,
        contactData.SHcity,
        contactData.SHsuburb,
        contactData.SHprovince,
        contactData.SHcountry,
        contactData.SHpostal
    ];

    const shipAddressString = shipAddressComponents.filter(Boolean).join(", ");
    let shippingAddress = shipAddressString;

    if (contactData.shipping === "Billing") {
        shippingAddress = addressString;
    }

    if (contactData.shipping === "Collect") {
        shippingAddress = "COLLECTION";
    }

    if (contactData.shipping === "Shipping" && !shippingAddress) {
        return new NextResponse("Shipping address is required when shipping differs from billing", { status: 400 });
    }

    try {
        const order = await prismadb.order.create({
            data: {
                storeId: params.storeId,
                isPaid: false,
                isShipped: false,
                orderItems: {
                    create: orderItems.map((item: { productId: string; quantity: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    }))
                },
                phone: contactData.phone,
                email: contactData.email,
                firstName: contactData.firstname,
                lastName: contactData.lastname,
                address: addressString,
                shippingAddress,
                shippingMethod: contactData.shipping,
                shippingMessage: contactData.message,
                vatNumber: contactData.vatNumber,
            }
        });

        return NextResponse.json({
            url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`
        }, {
            headers: corsHeaders
        });
    } catch (error) {
        console.error("Order creation failed:", error);

        return NextResponse.json({
            url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`
        }, {
            headers: corsHeaders
        });
    }
}
