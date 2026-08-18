import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import InvoiceFile from "./components/invoice";
import { notFound } from "next/navigation";

const OrderPage = async ({
    params
}: {
    params: { storeId: string, orderId: number }
}) => {
    const order = await prismadb.order.findFirst({
        where: {
            orderNumber: Number(params.orderId)
        },
        include: {
            orderItems: {
                include: {
                    product: true, // Fetch product data
                },
            },
        },
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading 
                title={"Invoice PDF"}
                description={"Download the invoice for this order."}
                />
                <Separator />

                {/* Invoice */}
                <InvoiceFile data={order} /> 
            </div>
        </div>
    );
}

export default OrderPage;
