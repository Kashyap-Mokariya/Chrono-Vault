"use server"

import { createClient } from "@/lib/supabase/server"

interface UserData {
    email: string | null
    fullName: string | null
}

interface AuthResponse {
    error: string | null,
    success: boolean,
    data: UserData | null
}

export async function GetUserInfo(): Promise<AuthResponse> {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    const email = user?.email || null
    const fullName = user?.user_metadata?.fullName || null

    return {
        error: error?.message || "There was an error while fetching the user details",
        success: !error,
        data: { email, fullName }
    }
}