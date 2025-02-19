'use client';

import { z } from "zod";
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Store } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

interface ShippingPageProps {
  initialData: Store | null;
};

const formSchema = z.object({
    shiping_returns: z.string().min(1),
});

type ShippingFormValues = z.infer<typeof formSchema>;

const ShippingPolicyForm: React.FC<ShippingPageProps> = ({
  initialData 
}) => {
  const params = useParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    const form = useForm<ShippingFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData ? {
        ...initialData,
        shiping_returns: initialData.shiping_returns ?? '', // Convert null to an empty string
        } : {
          shiping_returns: '' // Initial value for the text area
      }
    });
  
    const onSubmit = async (data: ShippingFormValues) => {
      try {
        setLoading(true);
        console.log(data);
        await axios.patch(`/api/stores/${params.storeId}/shipping`, data);
        router.push(`/${params.storeId}/settings`);
        toast.success('Shipping policy updated.');
      } catch (error) {
        toast.error('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
        <div className="p-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-1 gap-8">
                    <FormField
                    control={form.control}
                    name="shiping_returns"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-3xl">Shipping & Returns Policy</FormLabel>
                        <FormControl>
                            <textarea
                            {...field}
                            disabled={loading}
                            placeholder="Enter your Shipping and Returns policy"
                            className="textarea w-full h-32 border border-black rounded-md p-2"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    Save changes
                </Button>
                </form>
            </Form>
        </div>
    );
  };
  
  export default ShippingPolicyForm;