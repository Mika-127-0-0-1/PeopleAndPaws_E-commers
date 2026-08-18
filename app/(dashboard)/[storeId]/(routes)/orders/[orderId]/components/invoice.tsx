"use client";

import { Page, Text, View, Document, Image, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { styles } from './style';
import { formatter } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from 'react';
import toast from "react-hot-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Prisma } from "@prisma/client";

const formSchema = z.object({
    shippingPrice: z.coerce.number(),
});

type ShippingFormValues = z.infer<typeof formSchema>;

interface InvoiceProps {
    data: Prisma.OrderGetPayload<{
        include: {
            orderItems: {
                include: {
                    product: true;
                };
            };
        };
    }>;
};

const InvoiceFile: React.FC<InvoiceProps> = ({
    data
}) =>{
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);

    const form = useForm<ShippingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shippingPrice: Number(data.shippingPrice),
        }
    });

    const onSubmit = async (formData: ShippingFormValues) => {
        try {
            setLoading(true);
            // if(data.shippingPrice > 0) {
            // console.log(formData);
            await axios.patch(`/api/stores/${params.storeId}/orders/${params.orderId}`, formData);
            // }
            // router.push(`/${params.storeId}/orders/${}`);
            router.refresh();
            toast.success("Shipping value successfully added.");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    // Format: "THERA-0001", "THERA-0002", etc.
    const formattedInvoiceNo = `THERA-${data.orderNumber.toString().padStart(4, '0')}`;

    const InvoicePDF = () => (
        <Document>
        <Page size="A4" style={styles.page}>
        <View>
                {/* Watermark Image */}
                {/* eslint-disable-next-line jsx-a11y/alt-text -- React PDF images do not support the HTML alt prop. */}
                <Image src={`${window.location.origin}/favicon_Final_img.png`} style={styles.background} />
            <View style={styles.header}>
            {/* <View> */}
                {/* Logo Image */}
                {/* eslint-disable-next-line jsx-a11y/alt-text -- React PDF images do not support the HTML alt prop. */}
                <Image src={`${window.location.origin}/Therapeuo_logo.jpg`} style={styles.logoIMG}/>
            {/* </View> */}
            <View style={styles.spaceY}>
                <Text style={[styles.title, styles.textBold]}>INVOICE</Text>
                <Text>Invoice #{formattedInvoiceNo}</Text>
                <Text>Date: {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }).format(data.createdAt)}</Text>
                <Text>076 953 0163 </Text>
                <Text>sonet.browne@gmail.com</Text>
                {/* <Text style={styles.textBold}>Therapuo</Text> */}
                <Text>Shop 11, Oudewerf, Galloway St, </Text>
                <Text>Sybrand Van Niekerk Park, Meyerton, 1960 </Text>
            </View>
            </View>
    
            <View style={styles.spaceY}>
            <Text style={[styles.billTo, styles.textBold]}>Bill To:</Text>
            { data.company && (
                <Text style={styles.billTo}>Company: {data.company}</Text>
            )}
            <Text>{data.firstName} {data.lastName}</Text>
            <Text>{data.address}</Text>
            <Text>{data.phone}</Text>
            <Text>{data.email}</Text>
            { data.vatNumber && (
                <Text style={styles.billTo}>Vat nr.: {data.vatNumber}</Text>
            )}
            </View>


            { data.shippingAddress && (
                <View style={styles.spaceY}>
            <Text style={[styles.billTo, styles.textBold]}>Ship To:</Text>
            <Text>{data.shippingAddress}</Text>
            </View>
            )}
    
            {/* Table Container */}
            <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>ITEMS</Text>
                <Text style={styles.tableCell}>QUANTITY</Text>
                <Text style={styles.tableCell}>UNIT PRICE (Incl.)</Text>
                <Text style={styles.tableCell}>LINE TOTAL</Text>
                </View>

                {/* Table Rows */}
                {data?.orderItems.map((item) => (
                    <View key={item.id} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.product.name}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>{formatter.format(Number(item.product.price))}</Text>
                    <Text style={styles.tableCell}>{formatter.format(Number(item.product.price) * item.quantity)}</Text>
                </View>
                ))}
                    {/* Shipping - always shown */}
                    {(() => {
                        const shippingPrice = Number(data.shippingPrice || 0);
                        // const shippingPrice = "TBD";
                        return (
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Shipping</Text>
                                <Text style={styles.tableCell}>{data.shippingAddress || ""}</Text>
                                <Text style={styles.tableCell}>{formatter.format(shippingPrice)}</Text>
                                <Text style={styles.tableCell}>{formatter.format(shippingPrice)}</Text>
                            </View>
                        );
                    })()} 

                {/* Table Totals */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}>TOTAL including vat.</Text>
                    <Text style={styles.tableCell}>{formatter.format(data.orderItems.reduce((total, item) => {return total + (Number(item.product.price) * item.quantity)}, Number(data.shippingPrice || 0)))} </Text>
                </View>
            </View>

            <View style={styles.spaceY}>
            <Text style={styles.billTo}>Please make all electronic payments to:</Text>
            <Text style={styles.textBold}>Account holder:          Sonet</Text>
            <Text style={styles.textBold}>Bank name:                Tyme Bank</Text>
            <Text style={styles.textBold}>Account number:       510 483 821 59</Text>
            <Text style={styles.textBold}>Branch code:              678910</Text>
            <Text style={styles.textBold}>Use payment reference: {formattedInvoiceNo}</Text>
            </View>

            <View style={styles.spaceY}>
            <Text style={[styles.billTo, styles.textBold]}></Text>
            <Text>On acceptance of this quotation and payment, you accept our terms and conditions.</Text>
            <Text>This can be viewed here: https://therapuo.co.za/terms</Text>
            </View>
            </View>
        </Page>
        </Document>
    );
    return (
        <div className="my-10 grid min-h-[calc(100vh-5rem)] grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex min-w-0 flex-col space-y-8">
                <div>
                    <h2 className="mb-2 text-lg font-bold">Shipping Message</h2>
                    <p>{data.shippingMessage ? data.shippingMessage : "No shipping message."}</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                        <FormField
                            control={form.control}
                            name="shippingPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shipping Price</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="130" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        <Button disabled={loading} type="submit">
                            Submit shipping price
                        </Button>
                    </form>
                </Form>

                <div className="flex flex-wrap gap-6">
                    <PDFDownloadLink document={<InvoicePDF />} fileName={`${formattedInvoiceNo}.pdf`}>
                        <Button>
                            Download PDF
                        </Button>
                    </PDFDownloadLink>
                    <Button onClick={() => router.push(`/${params.storeId}/orders`)}>
                        Back
                    </Button>
                </div>
            </div>

            <div className="min-h-[700px] min-w-0 overflow-hidden rounded-md border">
                <PDFViewer width="100%" height="100%">
                    <InvoicePDF />
                </PDFViewer>
            </div>
        </div>
    );
}

export default InvoiceFile;
