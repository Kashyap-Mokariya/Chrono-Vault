"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface AuthResponse {
    error: string | null,
    success: boolean,
    data: unknown | null
}

export async function SignUp(formData: FormData): Promise<AuthResponse> {

    const supabase = await createClient()

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                fullName: formData.get("fullName") as string
            }
        }
    }

    const { data: signupData, error } = await supabase.auth.signUp(data)

    return {
        error: error?.message || "There was an error while creating the user",
        success: !error,
        data: signupData || null
    }
}

export async function Login(formData: FormData): Promise<AuthResponse> {

    const supabase = await createClient()

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string
    }

    const { data: loginData, error } = await supabase.auth.signInWithPassword(data)

    return {
        error: error?.message || "There was an error logging in",
        success: !error,
        data: loginData || null
    }
}

export async function Logout(): Promise<void> {
    const supabase = await createClient()

    await supabase.auth.signOut()

    redirect("/login")
}

export async function ResetEmailConfirmation(values: {email: string}): Promise<AuthResponse> {
    const supabase = await createClient()

    const {data: resetPassData, error} = await supabase.auth.resetPasswordForEmail(values.email)

    return {
        error: error?.message || "There was an error while resetting the password",
        success: !error,
        data: resetPassData || null
    }
}

export async function ChangePassword(newPassword: string): Promise<AuthResponse> {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    })

    return {
        error: error?.message || "There was an error while updating the password",
        success: !error,
        data: data || null
    }
}