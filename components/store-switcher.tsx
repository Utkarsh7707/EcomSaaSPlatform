"use client";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import prismadb from "@/lib/prismadb";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";


type PopoverTriggerProps =  React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps{
    items : Store[]
}

export function StoreSwitcher({className , items = []} : StoreSwitcherProps)
{
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item)=>({
        label : item.name,
        value : item.id
    }));
    const [open , setOpen] = useState(false);
    function onStoreSelect(store : {value :string , label :string}){
        setOpen(false);
        router.push(`/${store.value}`)
    };
    const currentStore = formattedItems.find((item)=> item.value === params.storeId); 
    // console.log("HII",currentStore?.value);
    // console.log("Params:", params);

    return(
        <Popover open= {open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='outline' 
                    size='sm'
                    role="combobox"
                    aria-expanded = {open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between")}        >
                    <StoreIcon className="mr-2 w-4 h-4"></StoreIcon>
                        {currentStore ? currentStore.label : "Select Store"}
                    <ChevronsUpDown className="ml-auto w-4 h-4 shrink-0 opacity-50"></ChevronsUpDown>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                            <CommandInput  placeholder="search store..."/>
                            <CommandEmpty>No store Found</CommandEmpty>
                        <CommandGroup>
                            {formattedItems.map((store) => (
                                <CommandItem key={store.value} 
                                onSelect={()=>{onStoreSelect(store)}}
                                className="text-sm"  >
                                    <StoreIcon className="mr-2  h-4 w-4"></StoreIcon>
                                    {store.label}
                                    <Check className={
                                        cn("ml-auto h-4 w-4 " ,
                                        currentStore?.value === store.value ?
                                        "opacity-100" : "opacity-0")}></Check>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator/>
                        <CommandList>
                            <CommandGroup>
                                <CommandItem onSelect={()=>{setOpen(false)
                                    storeModal.onOpen();
                                }}>
                                    <PlusCircle  className="mr-4 w-5 h-5"/>
                                    Create Store
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}