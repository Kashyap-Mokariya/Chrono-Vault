"use server"

import { createClient } from "@/lib/supabase/server"
import { parseStringify } from "@/lib/utils"
import { revalidatePath } from "next/cache"

const handleError = (error: unknown, message: string) => {
    console.log(error, message)
    throw error
};

export const renameFile = async ({
    fileId,
    name,
    extension,
    path
}: RenameFileProps) => {
    const supabase = await createClient()

    try {
        const newName = `${name}.${extension}`

        const { data: updatedFile, error } = await supabase
            .from('files')
            .update({
                name: newName,
            })
            .eq('id', fileId)
            .select()

        revalidatePath(path)

        console.log("Updated file: ", updatedFile)

        return parseStringify(updatedFile)
    } catch (error) {
        handleError(error, "Failed to rename file")
    }
}