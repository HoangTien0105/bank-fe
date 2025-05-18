"use client"

import { Box } from "@chakra-ui/react";
import LoginForm from "./_components/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();

    useEffect(() => {
        //Kiểm tra người dùng đã đăng nhập chưa 
        const token = localStorage.getItem('auth_token');
        if(token){
            router.push('/dashboard')
        }
    }, [router])

    return (
        <Box className="flex min-h-screen justify-center items-center p-4 bg-black">
            <LoginForm/>
        </Box>
    )
}

export default Page;