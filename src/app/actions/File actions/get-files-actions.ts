"use server"

import { createClient } from "@/lib/supabase/server"
import { parseStringify } from "@/lib/utils";

interface Props {
    email: string | null
    userId: string | null
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message)
    throw error
};

export const getFiles = async (
    {
        userId,
        email
    }: Props
) => {
    const supabase = await createClient();

    try {
        if (!userId) {
            throw new Error("User ID is required");
        }
        if (!email) {
            throw new Error("Email is required");
        }

        const { data, error } = await supabase
            .from("files")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return {
                error: error.message || "Failed to fetch files",
                success: false,
                data: null
            }
        }

        return parseStringify(data)

    } catch (error) {
        handleError(error, "Failed to get files");
    }
}