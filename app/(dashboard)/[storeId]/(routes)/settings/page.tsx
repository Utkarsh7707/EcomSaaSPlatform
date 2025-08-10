import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/Settings-form";

export default async function Settings({params} : {
    params : Promise<{
        storeId : string
    }>
})
{
    const {userId} = await auth();
    const {storeId} = await params;
    if(!userId)
    {
        redirect("/sign-in");
    }
    const store = await prismadb.store.findFirst(
        {
            where : {
                id : storeId,
                userId : userId
            }
        }
    );
    if(!store)
    {
        redirect("/");
    }
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}></SettingsForm>
            </div>
        </div>
    );
}