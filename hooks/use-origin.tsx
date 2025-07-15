'use client';
import { useEffect, useState } from "react";

export function useOrigin()
{
    const[mounted , setMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin;
    //🔹 What does typeof window !== "undefined" mean?
    //In a browser, window exists.
    // On the server (like in Next.js SSR), window does not exist,
    // and trying to use it will cause an error.
    useEffect(()=>{
        setMounted(true);
    },[]);

    if(!mounted)
    {
        return null;
    }
    return origin;
}