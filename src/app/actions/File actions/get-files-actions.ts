"use server"

import { createClient } from "@/lib/supabase/server"
import { parseStringify } from "@/lib/utils";

const handleError = (error: unknown, message: string) => {
    console.log(error, message)
    throw error
};

export const getFiles = async ({ types = [] }: GetFilesProps) => {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("files")
            .select("*")
            .in('type', types)
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