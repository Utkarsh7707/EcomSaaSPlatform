'use client';
import { Trash } from "lucide-react";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import z, { bigint, string } from "zod"


import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApitAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { ImageUpload } from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    name : z.string().min(2),
    images : z.object({url : z.string()}).array(),
    price : z.coerce.number().min(1),
    categoryId : z.string().min(1),
    colorId :  z.string().min(1),
    sizeId :  z.string().min(1),
    isFeatured :z.boolean().default(false).optional(),
    isArchived : z.boolean().default(false).optional(),
});

// Create a serialized version of Product with number price instead of Decimal
type SerializedProduct = Omit<Product, 'price'> & {
    price: number;
    images: Image[];
};

interface ProductProps {
    initialData : SerializedProduct | null;
    categories : Category[]
    sizes : Size[]
    colors : Color[]
}


type ProductFormValues = z.infer<typeof formSchema>

export  function ProductForm( props : ProductProps)
{
        const params = useParams();
        const router = useRouter();
        const origin = useOrigin();
        const {initialData , categories , colors , sizes} =  props;

        const title = initialData ? "Edit product" : "Create product";
        const description = initialData ? "Edit product" : "Add a new product";
        const toastMessage = initialData ? "Product updated." : "Product created!";
        const action = initialData ? "Save" : "Create";
        // console.log("HII" ,initialData);
        const [open , setOpen] = useState(false); // for alert modal
        const [loading ,setLoading] = useState(false);
        const form = useForm<ProductFormValues>({
            resolver : zodResolver(formSchema),
            defaultValues : initialData ? {
                ...initialData,
                price : initialData.price, // Now it's already a number
            } : {
                name : '',
                images : [],
                price : 0,
                categoryId : '',
                colorId : '',
                sizeId : '',
                isFeatured : false,
                isArchived: false
            }
        }); 

        async function onSubmit( data : ProductFormValues)
        {
            try{
                setLoading(true);
                if(initialData)
                {
                    const res = await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data);
                }
                else{
                    console.log(data);
                    const res = await axios.post(`/api/${params.storeId}/products`,data);
                }
                toast.success(toastMessage);
                router.refresh();
                router.push(`/${params.storeId}/products`)
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
                const res = await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
                toast.success("Product deleted!");
                router.refresh();
                router.push(`/${params.storeId}/products`);
            }
            catch(error)
            {
                toast.error("Something went wrong!");
            }
            finally
            {
                setLoading(false);
                setOpen(false);
            }
        }
           const handleImageChange = (urls : any) => {
            // Check if urls is an array (multiple images) or a single string (single image)
            if (Array.isArray(urls)) {
                // Multiple images - convert to the expected format
                const imageObjects = urls.map(url => ({url}));
                form.setValue('images', [...form.getValues('images'), ...imageObjects]);
            } else {
                // Single image
                form.setValue('images', [...form.getValues('images'), {url: urls}]);
            }
        };

        const handleImageRemove = (urlToRemove : any) => {
            const updatedImages = form.getValues('images').filter(image => image.url !== urlToRemove);
            form.setValue('images', updatedImages);
        };
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
                    <FormField name ="images" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value.map((image)=> image.url)}
                                     disabled = {loading}
                                      onChange={handleImageChange}
                                    onRemove={ handleImageRemove}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                    )}/>

                    
                    <div className="grid grid-cols-3 gap-8">
                        <FormField name ="name" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Product name" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>


                         <FormField name ="price" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} type='number' placeholder="1999" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>


                        <FormField name ="categoryId" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select disabled= {loading } onValueChange={field.onChange}
                                 value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]" >
                                        <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category)=> (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>



                         <FormField name ="sizeId" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select disabled= {loading } onValueChange={field.onChange}
                                 value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]" >
                                        <SelectValue placeholder="Select a size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sizes.map((size)=> (
                                            <SelectItem key={size.id} value={size.id}>
                                                {size.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>


                         <FormField name ="colorId" control={form.control} render={({field})=> (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select disabled= {loading } onValueChange={field.onChange}
                                 value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]" >
                                        <SelectValue placeholder="Select a color" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {colors.map((color)=> (
                                            <SelectItem key={color.id} value={color.id}>
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>


                        <FormField name ="isFeatured" control={form.control} render={({field})=> (
                            <FormItem className="flex flex-row items-start border rounded-md p-3 space-x-3  space-y-0 my">
                                <FormControl >
                                    <Checkbox 
                                    checked = {field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>
                                        This product will appear on home page
                                    </FormDescription>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )}/>


                         <FormField name ="isArchived" control={form.control} render={({field})=> (
                            <FormItem className="flex flex-row items-start border rounded-md p-3 space-x-3  space-y-0 my">
                                <FormControl >
                                    <Checkbox 
                                    checked = {field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Archived</FormLabel>
                                    <FormDescription>
                                        This product will not appear anywhere in the store
                                    </FormDescription>
                                </div>
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