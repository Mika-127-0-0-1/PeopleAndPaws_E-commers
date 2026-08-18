import prismadb from "@/lib/prismadb";
import { PhysicalTherapyForm } from "./components/physical-therapy-form";

const PhysicalTherapyServicePage = async ({
    params,
}: {
    params: { storeId: string; serviceId: string };
}) => {
    const service = params.serviceId === "new"
        ? null
        : await prismadb.physicalTherapyService.findFirst({
            where: { id: params.serviceId, storeId: params.storeId },
        });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PhysicalTherapyForm initialData={service} />
            </div>
        </div>
    );
};

export default PhysicalTherapyServicePage;
