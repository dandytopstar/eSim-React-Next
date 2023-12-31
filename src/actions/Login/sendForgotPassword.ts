'use client'
import { token } from "@/utils/token";

export const SendForgotPassword = async (toast: any, customer_id: string) => {
    try {
        const res = await fetch(
            "https://test.esimplified.io/customer/esimpalace/api/customer_forgot_password/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    customer_id
                }),
            }
        );
        if (res.status === 200) { 
            toast.success("Password reset email sent!");
            return true; }
        throw "Connection Error!";
    } catch (error) {
        toast.error(error)
        return false;
    }
} 