import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
    { params }: { params: {storeId: string,  } }
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
}
// TODO: Quantities are not Implement