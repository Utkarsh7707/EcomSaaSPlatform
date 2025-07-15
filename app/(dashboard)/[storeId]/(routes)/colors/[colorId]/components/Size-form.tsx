'use client';
import { Trash } from "lucide-react";
import {  Color } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import z from "zod"


import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApitAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

const formSchema = z.object({
    name : z.string().min(2),
    value : z.string().min(4).regex(/^#/,{
        message : `String must be a valid hex code`,
    }),
});


interface ColorProps {
    initialData : Color | null;
}


type ColorFormValues = z.infer<typeof formSchema>

export  function ColorForm( props : ColorProps)
{
        const params = useParams();
        const router = useRouter();
        const origin = useOrigin();
        const {initialData} =  props;

        const title = initialData ? "Edit color" : "Create color";
        const description = initialData ? "Edit color" : "Add a new color";
        const toastMessage = initialData ? "Color updated." : "Color created!";
        const action = initialData ? "Save" : "Create";
        // console.log("HII" ,initialData);
        const [open , setOpen] = useState(false); // for alert modal
        const [loading ,setLoading] = useState(false);
        const form = useForm<ColorFormValues>({
            resolver : zodResolver(formSchema),
            defaultValues : initialData || {
                name : '',
                value : '',

            }
        }); 

        async function onSubmit( data : ColorFormValues)
        {
            try{
                setLoading(true);
                if(initialData)
                {   
                    console.log("PATCH URL:", `/api/${params.storeId}/colors/${params.colorId}`, data);
                    const res = await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`,data);
                }
                else{
                    const res = await axios.post(`/api/${params.storeId}/colors`,data);
                }
                toast.success(toastMessage);
                router.refresh();
                router.push(`/${params.storeId}/colors`)
            }
            catch(error)
            {
                toast.error("Something went wrong!");
            }
            finally
            {
                setLoading(false);
            }
        }

        async function onDelete()
        {
            try{
                setLoading(true);
                const res = await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
                toast.success("Color deleted!");
                router.refresh();
                router.push(`/${params.storeId}/colors`);
            }
            catch(error)
            {
                toast.error("Make sure you removed all products using this color first!");
            }
            finally
            {
                setLoading(false);
                setOpen(false);
            }
        }
    return (
        <>
            <AlertModal isOpen = {open} onClose={()=>{setOpen(false)}} loading = {loading} onConfirm={onDelete}></AlertModal>
            <div className="flex items-center justify-between">
                <Heading title = {title} description = {description}/>
                {
                    initialData && <Button 
                    size='icon' variant='destructive' 
                    onClick={()=>{setOpen(true);}} disabled= {loading} > 
                        <Trash />
                    </Button>
                }
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField name ="name" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Color name" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name ="value" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                        <Input disabled={loading} placeholder="Color value" {...field}/>
                                        <div className="p-4 border rounded-full" style={{backgroundColor : field.value }}/>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button type="submit"  disabled = {loading} >{action}</Button>
                </form>
            </Form>
            <Separator>
                <ApitAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
            </Separator>
        </>
    );
}