"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSocialModal } from "@/hooks/use-social-modal";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
 
const formSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
})

export const SocialModal = () => {
    const socialModal = useSocialModal();
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            url: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post(`/api/stores/${params.storeId}/socialLinks`, values);

            router.refresh();
            toast.success("Social Link Added!");
            socialModal.onClose();

        } catch (error) {
            toast.error("Something went wrong.");
            
        }finally {
            setLoading(false);
        }
    }

    return (

        <Modal
        title="Add Social link"
        description="Add a new social link to your store."
        isOpen={socialModal.isOpen}
        onClose={socialModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="facebook" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField
                            control={form.control}
                            name="url"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="https://www.facebook.com/{Id}" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button variant="outline"
                                onClick={socialModal.onClose}
                                disabled={loading}>
                                    Cancel
                                </Button>
                                <Button disabled={loading} type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};