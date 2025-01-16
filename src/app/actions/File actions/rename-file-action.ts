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

        return parseStringify(updatedFile)
    } catch (error) {
        handleError(error, "Failed to rename file")
    }
}

export const updateFileUsers = async ({
    fileId,
    emailsToRemove = [],
    emailsToAdd = [],
    path,
}: {
    fileId: string;
    emailsToRemove?: string[];
    emailsToAdd?: string[];
    path: string;
}) => {
    const supabase = await createClient();

    try {
        // Fetch the current shared_with array
        const { data: existingData, error: fetchError } = await supabase
            .from('files')
            .select('shared_with')
            .eq('id', fileId)
            .single();

        if (fetchError) throw fetchError;

        const currentEmails: string[] = existingData.shared_with || [];

        // Remove emails and add new ones, ensuring no duplicates
        const updatedEmails = Array.from(
            new Set(
                currentEmails
                    .filter((email) => !emailsToRemove.includes(email)) // Remove specified emails
                    .concat(emailsToAdd) // Add new emails
            )
        );

        // Update the database
        const { data: updatedFile, error: updateError } = await supabase
            .from('files')
            .update({ shared_with: updatedEmails })
            .eq('id', fileId)
            .select();

        if (updateError) throw updateError;

        // Revalidate the path for caching purposes
        revalidatePath(path);

        return parseStringify(updatedFile);
    } catch (error) {
        handleError(error, "Failed to update shared_with emails");
    }
};
