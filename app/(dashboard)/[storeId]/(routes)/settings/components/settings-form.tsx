'use client';

import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { SocialList, Store } from "@prisma/client";
// import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
// import prismadb from "@/lib/prismadb";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origen";
import SocialLinks from "./sosialLinks";

interface SettingsFormProps {
    initialData: Store;
    socials: SocialList[];
}

const formSchema = z.object({
    name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData,
    socials
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [loading, setLoading] = useState(false);

    // const socialLink = await prismadb.socialList.findMany({
    //     // where: {
    //     //     id: params.storeId
    //     // }
    // });

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            console.log(data);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store updated.");
        } catch (error) {
            toast.error("Somethiing went wrong");
        } finally {
            setLoading(false);
        }
    }

    // const onDelete = async () => {
    //     try {
    //         setLoading(true);
    //         await axios.delete(`/api/stores/${params.storeId}`);
    //         router.refresh();
    //         router.push("/");
    //         toast.success("Store deleted.");
    //     } catch (error) {
    //         toast.error("Make sure you remove all products and categories first.");
    //     } finally {
    //         setLoading(false);
    //         setOpenDelete(false);
    //     }
    // }

    return (
        <>
            {/* <AlertModal //Not deleting!!! Only store
            isOpen={openDelete}
            onClose={()=> setOpenDelete(false)}
            onConfirm={onDelete}
            loading={loading}
            /> */}
            <div className="flex items-center justify-between">
                <Heading 
                title="Settings"
                description="Manage store preferences"
                />
                {/* Delete btn not used */}
                {/* <Button 
                disabled={loading}
                variant="destructive"
                size='sm'
                onClick={() => setOpenDelete(true)}
                > 
                <Trash className="h-4 w-4"/>
                </Button> */}
            </div>        
            <Separator />
            <div className="flex flex-auto p-4 gap-8">
                <Button 
                disabled={loading}
                variant="default"
                size='sm'
                onClick={() => router.push(`/${params.storeId}/settings/ship`)}
                >
                    Shipping and Returns
                </Button>
                <Button 
                disabled={loading}
                variant="default"
                size='sm'
                onClick={() => router.push(`/${params.storeId}/settings/privacy`)}
                >
                    Privacy Policy
                </Button>
                <Button 
                disabled={loading}
                variant="default"
                size='sm'
                onClick={() => router.push(`/${params.storeId}/settings/terms`)}
                >
                    Terms and Conditions
                </Button>

                <SocialLinks items={socials}/>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name "{...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/stores/${params.storeId}`} variant="public"/>
        </>

    );
};