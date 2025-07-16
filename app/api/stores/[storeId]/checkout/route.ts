import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import crypto from "crypto";

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
  

const corsHeadders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

export async function OPTIONS(){
    return new NextResponse(null, {headers: corsHeadders});
}

export async function POST(
    req: Request,
    { params }: { params: {storeId: string } }
){
    const {productIds, encryptedData: {encrypted, iv}} = await req.json();
    // const {productIds} = await req.json();

    if(!productIds || productIds.length === 0){
        return new NextResponse("Product Ids is required", {status: 400});
    }

    const product = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    });

    const secretKey = crypto.createHash("sha256").update(process.env.ENCRYPTION_SECRET || "sk_test_ThDgaPIeTfMIWmoijn4MHEoCi8zH6g1mb80WQuYBfg").digest(); // Converts to 32-byte Buffer

    // Decryption function
    const decryptData = (encryptedText: string, ivHex: string): DecryptedData => {
        const decipher = crypto.createDecipheriv("aes-256-ctr", secretKey, Buffer.from(ivHex, "hex")); // ✅ IV correctly converted
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
    
        return JSON.parse(decrypted) as DecryptedData;
    };

    const decryptedData = decryptData(encrypted, iv);
    // console.log(encrypted);

    const addressComponents = [
        decryptedData?.flatNO,
        decryptedData?.streetAddress,
        decryptedData?.city,
        decryptedData?.suburb,
        decryptedData?.province,
        decryptedData?.country,
        decryptedData?.postal
    ];

    const addressString = addressComponents.filter(Boolean).join(", ");

    const shipAddressComponents = [
        decryptedData?.SHflatNO,
        decryptedData?.SHstreetAddress,
        decryptedData?.SHcity,
        decryptedData?.SHsuburb,
        decryptedData?.SHprovince,
        decryptedData?.SHcountry,
        decryptedData?.SHpostal
    ];

    const shipAddressString = shipAddressComponents.filter(Boolean).join(", ");

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
                phone: decryptedData.phone,
                email: decryptedData.email,
                firstName: decryptedData.firstname,
                lastName: decryptedData.lastname,
                address: addressString,
                shippingAddress: shipAddressString,
                shippingMethod: decryptedData.shipping,
                shippingMessage: decryptedData?.message,
                vatNumber: decryptedData?.vatNumber,
            }
        });

        return NextResponse.json({
            url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`
    }, {
            headers: corsHeadders});
        } catch (error) {
            console.error("Order creation failed:", error);
        
            // ✅ Error - Redirect to error page or custom fallback URL
            return NextResponse.json({
                url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`
            }, { headers: corsHeadders });
    }
}
// TODO: Quantities are not Implement