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

        const { data, error } = await query

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

export async function getTotalSpaceUsed() {

    const supabase = await createClient()

    try {

        const { data: { user }} = await supabase.auth.getUser()

        if (!user) throw new Error("User is not authenticated.");

        const { data: files, error } = await supabase
        .from("files")
        .select('*')
        .eq("user_id", user.id)

        const totalSpace = {
            image: { size: 0, latestDate: "" },
            document: { size: 0, latestDate: "" },
            video: { size: 0, latestDate: "" },
            audio: { size: 0, latestDate: "" },
            other: { size: 0, latestDate: "" },
            used: 0,
            all: 1 * 1024 * 1024 * 1024 /* 1GB available bucket storage */,
        };

        if(!files) {
            return handleError(error, "Failed to get files")
        }

        files.forEach((file: SupabaseFile) => {
            const fileType = file.type as FileType;
            totalSpace[fileType].size += file.size;
            totalSpace.used += file.size;

            if (
                !totalSpace[fileType].latestDate ||
                new Date(file.updated_at) > new Date(totalSpace[fileType].latestDate)
            ) {
                totalSpace[fileType].latestDate = file.updated_at;
            }
        });

        return parseStringify(totalSpace);
    } catch (error) {
        handleError(error, "Error calculating total space used:, ");
    }
}