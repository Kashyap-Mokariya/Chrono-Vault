// "use server"

// import { createClient } from "@/lib/supabase/server"

// export const uploadFile = async ({
//     file,
//     ownerId,
//     accountId,
//     path
// }: UploadFileProps) => {

// }

"use server";

import { createClient } from "@/lib/supabase/server";
import { getFileType } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Database } from "../../../database.types";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const uploadFile = async ({
    file,
    userId,
    path,
}: UploadFileProps) => {
    const supabase = await createClient();

    try {
        const {data, error} = await supabase.storage
            .from("files")
            .upload(userId + '/' + file.name, file);

        if (error) {
            handleError(error, "Failed to upload file to Supabase");
        }

        console.log("file data: ", data)

        const { data: urlData} = await supabase.storage.from("files").createSignedUrl(data ? data.id : "", 3600)

        console.log(urlData)

        const fileDocument: Database["public"]["Tables"]["files"]["Insert"] = {
            type: getFileType(data ? data.path : "").type,
            name: file.name,
            url: urlData?.signedUrl || "",
            extension: getFileType(data ? data.path : "").extension,
            size: file.size,
            user_id: userId,
        };

        const { error: dbError } = await supabase
            .from("files")
            .insert(fileDocument)
            .select();

        if (dbError) {
            await supabase.storage.from("files").remove([data ? data.id : ""]);
            handleError(dbError, "Failed to create file document in database");
        }

        revalidatePath(path);
        return fileDocument;
    } catch (error) {
        handleError(error, "Failed to upload file");
    }
};

