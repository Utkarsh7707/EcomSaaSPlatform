'use client';
import * as z from "zod"
import axios from "axios"
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    name : z.string().min(3)
});
export function StoreModal()
{
    const storeModal = useStoreModal();
    const [loading , setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver : zodResolver(formSchema),
        defaultValues :{
            name:""
        }
    })

    async function onSubmit(values : z.infer<typeof formSchema>)
    {
        // console.log(values);
        // TO DO : create store

        try{
            setLoading(true);
            const res = await axios.post('/api/stores' , values);
            toast.success("Store Created !");
            window.location.assign(`/${res.data.id}`);
        }
        catch(error)
        {
            toast.error("Something went wrong !")
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <Modal title="Create" description="Add a new store to manage products and categories" isOpen = {storeModal.isOpen} onClose={storeModal.onClose}>
            <div>
                <div className="space-y-4 py-4 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name="name" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-commerce" {...field} disabled = {loading}></Input>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}/>
                            <div className="pt-5 space-x-2 flex items-center justify-end">
                                <Button variant='outline' onClick={storeModal.onClose} disabled = {loading} >Cancle</Button>
                                <Button type="submit" disabled = {loading}>Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}