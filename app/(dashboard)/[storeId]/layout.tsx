import { Navbar } from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children, 
    params
}: {
    children: React.ReactNode,
    params: Promise<{ storeId: string }>
}) {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    // Await the params promise
    const {storeId} = await params;
    
    const store = await prismadb.store.findFirst({
        where: {
            userId: userId,
            id: storeId
        }
    });
    
    if (!store) {
        redirect("/");
    }
    
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}