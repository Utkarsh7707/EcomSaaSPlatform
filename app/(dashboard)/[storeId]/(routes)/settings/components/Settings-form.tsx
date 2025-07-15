'use client';
import { Trash } from "lucide-react";
import { Store } from "@prisma/client";
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

interface settingProps {
    initialData :Store
}

const formSchema = z.object({
    name : z.string().min(2)
});

type settingFormValues = z.infer<typeof formSchema>

export  function SettingsForm( props : settingProps)
{
        const parmas = useParams();
        const router = useRouter();
        const origin = useOrigin();
        const {initialData} =  props;
        // console.log("HII" ,initialData);
        const [open , setOpen] = useState(false); // for alert modal
        const [loading ,setLoading] = useState(false);
        const form = useForm<settingFormValues>({
            resolver : zodResolver(formSchema),
            defaultValues : initialData
        }); 

        async function onSubmit( data : settingFormValues)
        {
            try{
                setLoading(true);
                const res = await axios.patch(`/api/stores/${parmas.storeId}`,data);
                toast.success("Store Updated");
                router.refresh();
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
                const res = await axios.delete(`/api/stores/${parmas.storeId}`);
                toast.success("Store deleted!");
                router.refresh();
                router.push("/");
            }
            catch(error)
            {
                toast.error("Make sure you removed all products and categories first!");
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
                <Heading title = "Settings" description = "Manage store preferences"/>
                <Button size='icon' variant='destructive' onClick={()=>{setOpen(true);}} disabled= {loading} > <Trash /> </Button>
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField name="name" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button type="submit"  disabled = {loading} >Save changes</Button>
                </form>
            </Form>
            <Separator>
                <ApitAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${parmas.storeId}`} variant="public" />
            </Separator>
        </>
    );
}