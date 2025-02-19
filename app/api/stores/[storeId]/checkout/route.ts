import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { connect } from "http2";
import { NextResponse } from "next/server";

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
    const {productIds} = await req.json();

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

    // Prisma things....
    // const line_items = 

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
            
        }
    });

    // const session = 
}