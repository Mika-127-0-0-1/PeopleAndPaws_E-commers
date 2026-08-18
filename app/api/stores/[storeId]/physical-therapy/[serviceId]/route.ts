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

type RouteParams = { params: { storeId: string; serviceId: string } };

export async function GET(_req: Request, { params }: RouteParams) {
    try {
        if (!params.storeId || !params.serviceId) return new NextResponse("Store and service IDs are required", { status: 400 });
        const service = await prismadb.physicalTherapyService.findFirst({
            where: { id: params.serviceId, storeId: params.storeId, isArchived: false },
        });
        if (!service) return new NextResponse("Service not found", { status: 404 });
        return NextResponse.json(service);
    } catch (error) {
        console.log("[PHYSICAL_THERAPY_GET_ONE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!params.storeId || !params.serviceId) return new NextResponse("Store and service IDs are required", { status: 400 });

        const parsed = serviceSchema.safeParse(await req.json());
        if (!parsed.success) return new NextResponse(parsed.error.issues[0]?.message || "Invalid data", { status: 400 });

        const store = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
        if (!store) return new NextResponse("Unauthorized", { status: 403 });

        const result = await prismadb.physicalTherapyService.updateMany({
            where: { id: params.serviceId, storeId: params.storeId },
            data: parsed.data,
        });
        if (!result.count) return new NextResponse("Service not found", { status: 404 });
        return NextResponse.json(result);
    } catch (error) {
        console.log("[PHYSICAL_THERAPY_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!params.storeId || !params.serviceId) return new NextResponse("Store and service IDs are required", { status: 400 });

        const store = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
        if (!store) return new NextResponse("Unauthorized", { status: 403 });

        const result = await prismadb.physicalTherapyService.deleteMany({
            where: { id: params.serviceId, storeId: params.storeId },
        });
        if (!result.count) return new NextResponse("Service not found", { status: 404 });
        return NextResponse.json(result);
    } catch (error) {
        console.log("[PHYSICAL_THERAPY_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
