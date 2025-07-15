'use client';
import { CopyIcon, Server } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge , badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


interface ApiAlertProps{
    title : string,
    description : string,
    variant : "public" | "admin"
}

const textMap : Record<ApiAlertProps['variant'], string> = {
    public : "Public",
    admin : "Admin"
}

const variantMap: Record<ApiAlertProps['variant'], "secondary" | "destructive"> = {
    public: "secondary",
    admin: "destructive"
}

export function ApitAlert(props : ApiAlertProps)
{
    function onCopy()
    {
        console.log(props.description);
        navigator.clipboard.writeText(props.description);
        toast.success("API Route copied to the clipboard.")
    }
    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-4">  
                {props.title}
                <Badge variant={variantMap[props.variant]}>
                    {textMap[props.variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-5 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] 
                py-[0.2rem] font-mono text-sm font-semibold">
                    {props.description}
                </code>
                <Button variant='outline' size='icon' onClick={()=>{onCopy()}}>
                    <CopyIcon className="h-4 w-4"/>
                </Button>
            </AlertDescription>
        </Alert>
    );
}