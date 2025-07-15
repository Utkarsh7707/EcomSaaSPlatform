import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import { StoreSwitcher } from "@/components/store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { ModeToggle } from "./theme-toggle";


export async function Navbar()
{
    const { userId } = await auth();
    if(!userId)
    {
        redirect("/sign-in");
    }
    const stores = await prismadb.store.findMany(
        {
            where:{
                userId : userId
            }
        }
    );
    return(
        <div className="border-b">
            <div className="flex items-center h-16 px-4 space-x-0">
                <StoreSwitcher items={stores} />
               <MainNav></MainNav>
                <div className="ml-auto flex items-center space-x-6">
                    <ModeToggle/>
                    <UserButton afterSignOutUrl="/"></UserButton>
                </div>
            </div>
        </div>
    );
}