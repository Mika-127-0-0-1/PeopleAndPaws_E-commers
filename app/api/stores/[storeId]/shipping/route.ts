import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: {storeId: string } }
){
    try{
        // const { userId } = auth();
        const body = await req.json();

        const { shiping_returns} = body;

        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        if (!shiping_returns) {
            return new NextResponse("Text is required", {status: 400});
        }


        const store = await prismadb.store.update({
            where: {
                id: params.storeId,
            },
            data: {
                shiping_returns
            }
        });

        return NextResponse.json(store);

    } catch (error){
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}