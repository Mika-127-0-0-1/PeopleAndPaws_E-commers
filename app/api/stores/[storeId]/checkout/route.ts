import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

interface DecryptedData {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    company?: string;
    vatNumber?: string;
    shipping: string;
    message?: string;
    flatNO: string;
    streetAddress: string;
    city: string;
    suburb: string;
    province: string;
    country: string;
    postal: string;
    SHflatNO?: string;
    SHstreetAddress?: string;
    SHcity?: string;
    SHsuburb?: string;
    SHprovince?: string;
    SHcountry?: string;
    SHpostal?: string;
  }
  

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
    const { productIds, contactData } = await req.json();

    if(!productIds || productIds.length === 0){
        return new NextResponse("Product Ids is required", {status: 400});
    }

    if(!contactData){
        return new NextResponse("Contact data is required", {status: 400});
    }

    const product = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    });

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
                    create: productIds.map((productId: string) => ({
                        product: {
                            connect: {
                                id: productId
                            }
                        }
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
// TODO: Quantities are not Implement