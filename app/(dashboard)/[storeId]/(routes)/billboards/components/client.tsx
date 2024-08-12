'use client';

import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";

export const BillboardClient = () => {
    const params = useParams();
    const router = useRouter();
    // const [open, setOpen] = useState(false);
    // const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                title="Billboards (0)"
                description="Manage billboards for your store"
                />
                <Button 
                onClick={() => router.push(`/${params.storeId}/billboards/new`)}
                >
                <Plus className="mr-2 h-4 w-4"/>
                Add New
                </Button>
            </div>        
            <Separator />
           
        </>

    );
};