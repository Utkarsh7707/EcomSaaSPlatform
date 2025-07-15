'use client'

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import { CategoryColumn } from "../../categories/components/columns";
import { ProductColumn } from "./columns";

interface CellActionProps {
    data : ProductColumn
}

export function CellAction(props : CellActionProps)
{
    const router = useRouter();
    const params = useParams();
    function onCopy(id :string)
    {
        // console.log();
        navigator.clipboard.writeText(id);
        toast.success("Product Id copied to the clipboard.")
    }
    const[loading , setLoading] = useState(false);
    const [open , setOpen] = useState(false);
    async function onDelete()
        {
            try{
                setLoading(true);
                const res = await axios.delete(`/api/${params.storeId}/products/${props.data.id}`);
                toast.success("Product deleted!");
                router.refresh();
                // router.push("/");
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
    return(
        <>
            <AlertModal
             isOpen= {open}
             loading = {loading}
              onClose={()=>{setOpen(false);} }
              onConfirm={()=>{onDelete();}}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/products/${props.data.id}`)}>
                        <Edit className="h-4 w-4 mr-2" /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>onCopy(props.data.id)} >
                        <Copy className="h-4 w-4 mr-2" /> Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>{setOpen(true)}}>
                        <Trash className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}