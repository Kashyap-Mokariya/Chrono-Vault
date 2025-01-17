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
        const { data, error } = await supabase
            .from("files")
            .select("*")
            .in("type", types)
            .ilike("name", `%${searchText}%`)
            .order(sortBy, {
                ascending: order,
            })
            // .order(sort.split("-")[0], {
            //     ascending: sort.startsWith("asc"),
            // })
            .limit(limit);

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
