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

interface TermsPageProps {
  initialData: Store | null;
};

const formSchema = z.object({
    term_condition: z.string().min(1),
});

type TermFormValues = z.infer<typeof formSchema>;

const TermsPolicyForm: React.FC<TermsPageProps> = ({
  initialData 
}) => {
  const params = useParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    const form = useForm<TermFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData ? {
        ...initialData,
        term_condition: initialData.term_condition ?? '', // Convert null to an empty string
        } : {
          term_condition: '' // Initial value for the text area
      }
    });
  
    const onSubmit = async (data: TermFormValues) => {
      try {
        setLoading(true);
        console.log(data);
        await axios.patch(`/api/stores/${params.storeId}/terms`, data);
        router.push(`/${params.storeId}/settings`);
        toast.success('Terms policy updated.');
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
                name="term_condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-3xl">Terms and Conditions Policy</FormLabel>
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
  
  export default TermsPolicyForm;