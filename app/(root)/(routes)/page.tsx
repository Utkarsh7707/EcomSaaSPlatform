"use client";
import { StoreModal } from "@/components/modals/store-modal";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { ModalProvider } from "@/providers/modal-provider";
import { UserButton } from "@clerk/nextjs";
import { stat } from "fs";
import { Children, useEffect } from "react";

export default function SetupPage() {
  const isOpen = useStoreModal((state)=> state.isOpen)
  const onOpen = useStoreModal((state)=> state.onOpen)
  useEffect(()=>{
    if(!isOpen)
    {
      onOpen();
    }
  },[isOpen,onOpen]);
  return (
   null
    );
}
