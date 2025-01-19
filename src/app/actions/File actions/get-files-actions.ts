"use server";

import { createClient } from "@/lib/supabase/server";
import { parseStringify } from "@/lib/utils";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const getFiles = async ({
    types = [],
    searchText = "",
    sort = "created_at-desc",
    limit = 10000000,
}: GetFilesProps) => {
    const supabase = await createClient();

    const [sortBy, orderBy] = sort.split("-");
    const order = orderBy === "desc" ? false : true;

    try {
        let query = supabase.from("files").select("*")

        if (types.length > 0) {
            query = query
                .in("type", types)
                .ilike("name", `%${searchText}%`)
                .order(sortBy, {
                    ascending: order,
                })
                .limit(limit);
        } else {
            query = query
                .ilike("name", `%${searchText}%`)
                .order(sortBy, {
                    ascending: order,
                })
                .limit(limit);
        }

        const {data, error} = await query

        if (error) {
            return {
                error: error.message || "Failed to fetch files",
                success: false,
                data: null,
            };
        }

        return parseStringify(data);
    } catch (error) {
        handleError(error, "Failed to get files");
    }
};
