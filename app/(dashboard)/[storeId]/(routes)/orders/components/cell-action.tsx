"use client";

import { DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { OrderColumn } from "./columns";
import { Banknote, Copy, Edit, Eye, Mail, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: OrderColumn;
};

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    const onCopy = (id: number) => {
        const formattedcopy = `THERA-${id.toString().padStart(4, '0')}`;
        navigator.clipboard.writeText(formattedcopy);
        toast.success("Order Id copied to the clipboard.");
    };

    const onEmail = async () => {
        try {
            setLoading(true);
            // TODO: add email functionality
            toast.success("Order emaild.");
        } catch (error) {
            toast.error("Order chould not be emaild!");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onPaid = async () => {
        try {
            setLoading(true);
            // console.log(data);
            await axios.patch(`/api/stores/${params.storeId}/checkout/${data.invNumber}`, data);
            router.refresh();
            toast.success("Order paid status changed.");
        } catch (error) {
            toast.error("Order paid status not changed!");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            console.log(data.invNumber);
            await axios.delete(`/api/stores/${params.storeId}/checkout/${data.invNumber}?orderItemId=${data.id}`);
            router.refresh();
            toast.success("Order deleted.");
        } catch (error) {
            toast.error("Order Delete not working!");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }


    return (
        <>
            <AlertModal 
            isOpen={open}
            onClose={()=> setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    
                    >
                        <span className="sr-only">Open menu</span>    
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onCopy(data.invNumber)}>
                        <Copy className="mr-2 h-4 w-4"/>
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/orders/${data.invNumber}`)}>
                        <Eye className="mr-2 h-4 w-4"/>
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPaid()}>
                        <Banknote className="mr-2 h-4 w-4"/>
                        Paid?
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEmail()}>
                        <Mail className="mr-2 h-4 w-4"/>
                        Email?
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};