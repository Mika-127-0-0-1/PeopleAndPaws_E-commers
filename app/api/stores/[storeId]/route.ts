import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: {storeId: string } }
){
    try{
        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }
        
        const Store = await prismadb.store.findUnique({
            where: {
                id: params.storeId,
            },
        });

        return NextResponse.json(Store);

    } catch (error){
        console.log('[Store_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: {storeId: string } }
){
    try{
        const { userId } = auth();
        const body = await req.json();

        const { name, isMaintenance } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if (!name) {
            return new NextResponse("Name is required", {status: 400});
        }
        if (typeof isMaintenance !== "boolean") {
            return new NextResponse("Maintenance status is required", {status: 400});
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
                name,
                isMaintenance
            }
        });

        return NextResponse.json(store);

    } catch (error){
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: {storeId: string } } // Have to be second argument
){
    try{
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        });

        return NextResponse.json(store);

    } catch (error){
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}
