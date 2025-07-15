'use client';
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
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
import { ImageUpload } from "@/components/ui/image-upload";

const formSchema = z.object({
    label : z.string().min(2),
    imageUrl : z.string().min(1)
});


interface BillboardProps {
    initialData : Billboard | null;
}


type BillboardFormValues = z.infer<typeof formSchema>

export  function BillboardForm( props : BillboardProps)
{
        const params = useParams();
        const router = useRouter();
        const origin = useOrigin();
        const {initialData} =  props;

        const title = initialData ? "Edit billboard" : "Create billboard";
        const description = initialData ? "Edit billboard" : "Add a new billboard";
        const toastMessage = initialData ? "Billboard updated." : "Billboard created!";
        const action = initialData ? "Save" : "Create";
        // console.log("HII" ,initialData);
        const [open , setOpen] = useState(false); // for alert modal
        const [loading ,setLoading] = useState(false);
        const form = useForm<BillboardFormValues>({
            resolver : zodResolver(formSchema),
            defaultValues : initialData || {
                label : '',
                imageUrl : '',

            }
        }); 

        async function onSubmit( data : BillboardFormValues)
        {
            try{
                setLoading(true);
                if(initialData)
                {
                    const res = await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data);
                }
                else{
                    const res = await axios.post(`/api/${params.storeId}/billboards`,data);
                }
                toast.success(toastMessage);
                router.refresh();
                router.push(`/${params.storeId}/billboards`)
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
                const res = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
                toast.success("Billboard deleted!");
                router.refresh();
                router.push(`/${params.storeId}/billboards`);
            }
            catch(error)
            {
                toast.error("Make sure you removed all categories using this billboard first!");
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
                    <FormField name ="imageUrl" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []}
                                     disabled = {loading}
                                     onChange={(url)=>field.onChange(url)}
                                     onRemove={()=>field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                    )}/>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField name ="label" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Billboard label" {...field}/>
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