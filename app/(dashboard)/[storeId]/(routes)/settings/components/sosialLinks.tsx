'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SocialList, Store } from '@prisma/client';
import { ChevronsUpDown, PlusCircle, TrashIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';
import React, { useState } from 'react'

import { useSocialModal } from "@/hooks/use-social-modal";
import axios from 'axios';
import toast from "react-hot-toast";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: SocialList[];
};

const formSchema = z.object({
    name: z.string().min(1),
    // link: z.string().min(1),
  })

export default function SocialLinks({
    className,
    items = []
}: StoreSwitcherProps) {
    const socialModal = useSocialModal();
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onDelete = async (item: {id: string, name: string, url: string}) => {
        try {
            await axios.delete(`/api/stores/${params.storeId}/socialLinks/${item.id}`);
            router.refresh();
            toast.success("Social deleted.");
        } catch (error) {
            toast.error("ERROR!");
        } finally {
            
        }
    }

  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button 
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a Social"
            className={cn("w-[200px] justify-between", className)}
            >
                {/* <StoreIcon className="mr-2 h-4 w-4"/> */}
                Social Links
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                <CommandList>
                    <CommandGroup heading="Socials">
                        {items.map((item) => (
                            <CommandItem 
                            onSelect={() => onDelete(item)}
                            key={item.id}
                            // onSelect={() => onStoreSelect(store)}
                            className="text-sm flex flex-between justify-between">
                                {item.name}
                                <div>
                                    {/* <Button  size={"sm"} variant="ghost" onClick={onDelete}> */}
                                        <TrashIcon className="text-red-600" size={20}/>
                                    {/* </Button> */}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                        onSelect={() => {
                            setOpen(false)
                            socialModal.onOpen();
                        }}>
                            <PlusCircle className="mr-2 h-5 w-5"/>
                            Add Social
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
  )
};