import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import prismadb from "@/lib/prismadb";

const serviceSchema = z.object({
    name: z.string().trim().min(1),
    imageUrl: z.string().url(),
    description: z.string().trim().min(1),
    price: z.coerce.number().positive(),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
});

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });

        const { searchParams } = new URL(req.url);
        const isFeatured = searchParams.get("isFeatured");
        const services = await prismadb.physicalTherapyService.findMany({
            where: {
                storeId: params.storeId,
                isArchived: false,
                isFeatured: isFeatured === "true" ? true : undefined,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(services);
    } catch (error) {
        console.log("[PHYSICAL_THERAPY_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });

        const parsed = serviceSchema.safeParse(await req.json());
        if (!parsed.success) return new NextResponse(parsed.error.issues[0]?.message || "Invalid data", { status: 400 });

        const store = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
        if (!store) return new NextResponse("Unauthorized", { status: 403 });

        const service = await prismadb.physicalTherapyService.create({
            data: { ...parsed.data, storeId: params.storeId },
        });
        return NextResponse.json(service);
    } catch (error) {
        console.log("[PHYSICAL_THERAPY_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
