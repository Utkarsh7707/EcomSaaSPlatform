'use client';

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";


interface AlertModalProps{
    isOpen : boolean,
    onClose :()=>void,
    onConfirm : ()=>void,
    loading : boolean
}
export function AlertModal(props : AlertModalProps)
{
    const[isMounted , setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[]);   

    if(! isMounted)
    {
        return null;
    }
    return(
        <Modal isOpen = {props.isOpen} title="Are you sure ?" description="This action can't be undone!" onClose={props.onClose}>
            <div className="pt-5 space-x-2 flex items-center justify-end">
                <Button variant='outline' disabled = {props.loading} onClick={props.onClose}>Cancle</Button>
                <Button variant='destructive' disabled = {props.loading} onClick={props.onConfirm}>Continue</Button>
            </div>
        </Modal>
    );
}