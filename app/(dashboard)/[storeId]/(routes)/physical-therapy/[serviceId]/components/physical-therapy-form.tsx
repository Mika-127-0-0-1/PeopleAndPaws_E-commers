"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PhysicalTherapyService } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/Heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    imageUrl: z.string().url("An image is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().positive("Price must be greater than zero"),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export const PhysicalTherapyForm = ({ initialData }: { initialData: PhysicalTherapyService | null }) => {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            imageUrl: initialData.imageUrl,
            description: initialData.description,
            price: Number(initialData.price),
            isFeatured: initialData.isFeatured,
            isArchived: initialData.isArchived,
        } : {
            name: "",
            imageUrl: "",
            description: "",
            price: 0,
            isFeatured: false,
            isArchived: false,
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/stores/${params.storeId}/physical-therapy/${params.serviceId}`, data);
            } else {
                await axios.post(`/api/stores/${params.storeId}/physical-therapy`, data);
            }
            router.push(`/${params.storeId}/physical-therapy`);
            router.refresh();
            toast.success(initialData ? "Physical therapy service updated." : "Physical therapy service created.");
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}/physical-therapy/${params.serviceId}`);
            router.push(`/${params.storeId}/physical-therapy`);
            router.refresh();
            toast.success("Physical therapy service deleted.");
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading
                    title={initialData ? "Edit physical therapy service" : "Create physical therapy service"}
                    description={initialData ? "Edit this service" : "Add a new service"}
                />
                {initialData && (
                    <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value ? [field.value] : []}
                                    disabled={loading}
                                    onChange={field.onChange}
                                    onRemove={() => field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input disabled={loading} placeholder="Physical therapy name" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl><Input disabled={loading} type="number" min="0.01" step="0.01" placeholder="450.00" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem className="md:col-span-3">
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea disabled={loading} placeholder="Describe the physical therapy service" rows={6} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isFeatured" render={({ field }) => (
                            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={loading} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>Feature this service on the storefront.</FormDescription>
                                </div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isArchived" render={({ field }) => (
                            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={loading} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Archived</FormLabel>
                                    <FormDescription>Hide this service from the storefront API.</FormDescription>
                                </div>
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} type="submit">
                        {initialData ? "Save changes" : "Create"}
                    </Button>
                </form>
            </Form>
        </>
    );
};
