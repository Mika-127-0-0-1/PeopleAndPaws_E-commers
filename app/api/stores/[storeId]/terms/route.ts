import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: {storeId: string } }
){
    try{
        const { userId } = auth();
        const body = await req.json();

        const { term_condition } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if (!term_condition) {
            return new NextResponse("Name is required", {status: 400});
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                term_condition
            }
        });

        return NextResponse.json(store);

    } catch (error){
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}