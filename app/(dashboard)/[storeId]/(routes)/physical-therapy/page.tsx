import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { PhysicalTherapyClient } from "./components/client";
import { PhysicalTherapyColumn } from "./components/columns";

const PhysicalTherapyPage = async ({ params }: { params: { storeId: string } }) => {
    const services = await prismadb.physicalTherapyService.findMany({
        where: { storeId: params.storeId },
        orderBy: { createdAt: "desc" },
    });

    const data: PhysicalTherapyColumn[] = services.map((service) => ({
        id: service.id,
        name: service.name,
        price: formatter.format(service.price.toNumber()),
        isFeatured: service.isFeatured,
        isArchived: service.isArchived,
        createdAt: format(service.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PhysicalTherapyClient data={data} />
            </div>
        </div>
    );
};

export default PhysicalTherapyPage;
