"use server"

import { createClient } from "@/lib/supabase/server"
import { parseStringify } from "@/lib/utils"
import { revalidatePath } from "next/cache"

const handleError = (error: unknown, message: string) => {
    console.log(error, message)
    throw error
};


export const deleteFile = async ({
    fileId,
    fileName,
    path
}: DeleteFileProps) => {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    const userId = user?.id || null

    try {
        const {data: deletedFile, error: deletionError} = await supabase
            .from('files')
            .delete()
            .eq('id', fileId)

        const { data, error } = await supabase.storage.from('files').remove([`${userId}/${fileName}`]);

        if (error) {
            console.error('Error deleting file:', error);
            return;
        }

        revalidatePath(path)

        return parseStringify({status: "success"})
    } catch (error) {
        handleError(error, "Failed to rename file")
    }

}