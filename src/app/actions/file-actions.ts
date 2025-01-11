import { getFileType } from "@/lib/utils"
import { Database } from "../../../database.types"
import { createSupabaseClient } from "@/lib/supabase/client"


const handleError = (error: unknown, message: string) => {
    console.log(error, message)
    throw error
};

function getStorage() {
    const {storage} = createSupabaseClient()

    return storage
}

export const uploadFile = async ({
    file,
    userId,
    path,
}: UploadFileProps) => {
    const supabase = createSupabaseClient()
    const storage = getStorage()

    try {
        const {data, error} = await storage
            .from("files")
            .upload(userId + '/' + file.name, file);

        if (error) {
            handleError(error, "Failed to upload file to Supabase");
        }

        console.log("file data: ", data)

        const urlData = await storage.from("files").getPublicUrl(data ? data.path : "").data.publicUrl

        console.log(urlData)

        const fileDocument: Database["public"]["Tables"]["files"]["Insert"] = {
            type: getFileType(data ? data.path : "").type,
            name: file.name,
            url: urlData,
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

        return fileDocument;
    } catch (error) {
        handleError(error, "Failed to upload file");
    }
};
