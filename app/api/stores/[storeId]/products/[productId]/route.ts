import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } } // Have to be second argument
){
    try{
        if(!params.productId) {
            return new NextResponse("Product id is required", {status: 400});
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
            }
        });

        return NextResponse.json(product);

    } catch (error){
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: {storeId: string, productId: string } }
){
    try{
        const { userId } = auth();
        const body = await req.json();

        const { name, categoryId, price, sizeId, images, isFeatured, isArchived } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if (!name) {
            return new NextResponse("Name is required", {status: 400});
        }
        if (!images || !images.length) {
            return new NextResponse("Images are required", {status: 400});
        }
        if (!categoryId) {
            return new NextResponse("Category id is required", {status: 400});
        }
        // if (!colorId) {
        //     return new NextResponse("Color id is required", {status: 400});
        // }
        if (!sizeId) {
            return new NextResponse("Size id is required", {status: 400});
        }
        if (!price) {
            return new NextResponse("Price is required", {status: 400});
        }

        if(!params.productId) {
            return new NextResponse("Product Id is required", {status: 400});
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                // colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                storeId: params.storeId
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image)
                        ]
                    }
                },
            }
        })

        return NextResponse.json(product);

    } catch (error){
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: {storeId: string, productId: string } } // Have to be second argument
){
    try{
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.productId) {
            return new NextResponse("Product id is required", {status: 400});
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        });

        return NextResponse.json(product);

    } catch (error){
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}