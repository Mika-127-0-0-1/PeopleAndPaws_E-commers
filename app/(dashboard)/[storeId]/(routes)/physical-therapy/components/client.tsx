"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { columns, PhysicalTherapyColumn } from "./columns";

export const PhysicalTherapyClient = ({ data }: { data: PhysicalTherapyColumn[] }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Physical Therapy (${data.length})`}
                    description="Manage physical therapy services"
                />
                <Button onClick={() => router.push(`/${params.storeId}/physical-therapy/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading title="API" description="API calls for Physical Therapy services" />
            <Separator />
            <ApiList entityName="physical-therapy" entityIdName="serviceId" />
        </>
    );
};
