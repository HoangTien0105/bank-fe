import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function CustomerLayout({children} : {children: ReactNode}) {
    const session = await auth();
    
    if(!session?.user || session.user.role !== 'CUSTOMER') {
        redirect('/login');
    }

    return (
        <>
        {children}
        </>
    )
}