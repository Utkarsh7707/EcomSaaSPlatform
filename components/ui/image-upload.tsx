'use client';
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import { ImagePlus, PlusIcon, Trash } from "lucide-react";


import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    disabled ?: boolean;
    onChange : (value : string)=> void;
    onRemove : (value : string)=> void;
    value : string[]
}
export function ImageUpload(props : ImageUploadProps)
{
    const[isMounted , setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    } ,[]);
    
    function onUpload(result : any)
    {
         console.log("Upload result:", result);
        props.onChange(result.info.secure_url)
    }

    if(!isMounted)
    {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {props.value.map((url)=>(
                    <div key={url} className=" relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={()=>props.onRemove(url)} variant='destructive' size='icon'>
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt=" Image" 
                            src = {url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget onSuccess={onUpload} uploadPreset='atcxlco4'>
                 {({ open }) => {
                    return (
                    <Button onClick={() => open() } type='button' disabled={props.disabled} variant='secondary'>
                        <ImagePlus className='h-4 w-4 mr-2' />
                        Upload an image
                    </Button>
                    );
                }}
            </CldUploadWidget>   
        </div>
    );
}