import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Store as StoreIcon } from "lucide-react";
import { ModeToggle } from "./ui/theme-toggle";

const Navbar = async () => {
    const {userId} = auth();
    if(!userId) {
        redirect("/sign-in");
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId,
        },
    });

    return(
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                {/* <StoreSwitcher items={stores}/> */}
                <StoreIcon className="mr-2 h-4 w-4"/>
                    {stores?.[0]?.name}
                <MainNav className="mx-6"/>
                <div className="ml-auto flex items-center space-x-4">
                    <ModeToggle />
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
    );
}

export default Navbar;