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
    sort = `$createdAt-desc`,
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

// "use server"

// import { createClient } from "@/lib/supabase/server"
// import { parseStringify } from "@/lib/utils";

// const handleError = (error: unknown, message: string) => {
//     console.log(error, message)
//     throw error
// };

// const buildFileQuery = (
//     query: any,
//     { types = [], searchText = "", sort = "$createdAt-desc", limit }: GetFilesProps
// ) => {
//     let filters = [];

//     // Build type filter
//     if (types.length > 0) {
//         filters.push(`type.in.(${types.join(',')})`);
//     }

//     // Build search filter
//     if (searchText) {
//         filters.push(`or(name.ilike.%${searchText}%,description.ilike.%${searchText}%)`);
//     }

//     // Build sort filter
//     if (sort) {
//         const [field, direction] = sort.replace('$', '').split('-');
//         const sortField = field === 'createdAt' ? 'created_at' : field;
//         filters.push(`order=${sortField}.${direction === 'asc' ? 'asc' : 'desc'}`);
//     }

//     // Build limit filter
//     if (limit && limit > 0) {
//         filters.push(`limit=${limit}`);
//     }

//     // Apply all filters together
//     if (filters.length > 0) {
//         query = query.and(filters.join(','));
//     }

//     return query;
// };

// export const getFiles = async ({
//     types = [],
//     searchText = "",
//     sort = `$createdAt-desc`,
//     limit
// }: GetFilesProps) => {
//     const supabase = await createClient();

//     try {
//         let baseQuery = supabase.from("files").select("*");

//         const query = buildFileQuery(baseQuery, {
//             types,
//             searchText,
//             sort,
//             limit
//         });

//         const { data, error } = await query;

//         if (error) {
//             return {
//                 error: error.message || "Failed to fetch files",
//                 success: false,
//                 data: null
//             }
//         }

//         return parseStringify(data)

//     } catch (error) {
//         handleError(error, "Failed to get files");
//     }
// }

// interface GetFilesProps {
//     types?: string[];
//     searchText?: string;
//     sort?: string;
//     limit?: number;
// }
