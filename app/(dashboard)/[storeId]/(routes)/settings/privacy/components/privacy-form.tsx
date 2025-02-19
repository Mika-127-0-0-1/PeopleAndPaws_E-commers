'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client";

interface PrivacyPageProps {
    initialData: Store | null;
};

const formSchema = z.object({
  privacy_policy: z.string().min(1),
});

type PrivacyFormValues = z.infer<typeof formSchema>;

const PrivacyPolicyForm: React.FC<PrivacyPageProps> = ({
    initialData
}) => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    const form = useForm<PrivacyFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData ? {
        ...initialData,
        privacy_policy: initialData.privacy_policy ?? '', // Convert null to an empty string
        } : {
        privacy_policy: '' // Initial value for the text area
      }
    });
  
    const onSubmit = async (data: PrivacyFormValues) => {
      try {
        setLoading(true);
        console.log(data);
        await axios.patch(`/api/stores/${params.storeId}/privacy`, data);
        router.push(`/${params.storeId}/settings`);
        toast.success('Privacy policy updated.');
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
                name="privacy_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-3xl">Privacy Policy</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        disabled={loading}
                        placeholder="Enter your Privacy and Returns policy"
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
  
  export default PrivacyPolicyForm;