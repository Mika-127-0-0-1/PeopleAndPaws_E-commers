import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: {storeId: string } }
){
    try{
        const { userId } = auth();
        const body = await req.json();

        const { name, url } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if (!name) {
            return new NextResponse("Name is required", {status: 400});
        }
        if (!url) {
            return new NextResponse("Link is required", {status: 400});
        }
        
        if(!params.storeId) {
            return new NextResponse("Store Id is required", {status: 400});
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

        const socialLink = await prismadb.socialList.create({
            data: {
                name,
                url,
                storeId: params.storeId
            }
        });

        return NextResponse.json(socialLink);

    } catch (error){
        console.log('[SOCIALLINK_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } } // Have to be second argument
){
    try{
        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        const socialLink = await prismadb.socialList.findMany({
            // where: {
            //     storeId: params.storeId,
            // },
        });

        return NextResponse.json(socialLink);

    } catch (error){
        console.log('[SOCIALLINK_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: {storeId: string, socialListId: string } } // Have to be second argument
){
    try{
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.socialListId) {
            return new NextResponse("Social id is required", {status: 400});
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

        const socialLink = await prismadb.socialList.deleteMany({
            where: {
                id: params.socialListId,
            }
        });

        return NextResponse.json(socialLink);

    } catch (error){
        console.log('[SOCIALLINK_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}