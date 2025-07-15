'use client';
import { Trash } from "lucide-react";
import { Billboard, Category } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    name : z.string().min(2),
    billboardId : z.string().min(1),
});


interface CategoryProps {
    initialData : Category | null;
    billboards : Billboard[]
}


type CategoryFormValues = z.infer<typeof formSchema>

export  function CategoryForm( props : CategoryProps)
{
        const params = useParams();
        const router = useRouter();
        const origin = useOrigin();
        const {initialData ,billboards} =  props;

        const title = initialData ? "Edit category" : "Create category";
        const description = initialData ? "Edit category" : "Add a new category";
        const toastMessage = initialData ? "Category updated." : "Category created!";
        const action = initialData ? "Save" : "Create";
        // console.log("HII" ,initialData);
        const [open , setOpen] = useState(false); // for alert modal
        const [loading ,setLoading] = useState(false);
        const form = useForm<CategoryFormValues>({
            resolver : zodResolver(formSchema),
            defaultValues : initialData || {
                name : '',
                billboardId : '',
            }
        }); 

        async function onSubmit( data : CategoryFormValues)
        {
            try{
                setLoading(true);
                if(initialData)
                {
                    const res = await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data);
                }
                else{
                    const res = await axios.post(`/api/${params.storeId}/categories`,data);
                }
                toast.success(toastMessage);
                router.refresh();
                router.push(`/${params.storeId}/categories`)
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
                const res = await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
                toast.success("Category deleted!");
                router.refresh();
                router.push(`/${params.storeId}/categories`);
            }
            catch(error)
            {
                toast.error("Make sure you removed all products using this category first!");
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
                                    <Input disabled={loading} placeholder="Category name" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                          <FormField name ="billboardId" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <Select disabled= {loading || !!initialData} onValueChange={field.onChange}
                                 value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]" >
                                        <SelectValue placeholder="Select a billboard" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {billboards.map((billboard)=> (
                                            <SelectItem key={billboard.id} value={billboard.id}>
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button type="submit"  disabled = {loading} >{action}</Button>
                </form>
            </Form>
            <Separator>
                {/* <ApitAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" /> */}
            </Separator>
        </>
    );
}