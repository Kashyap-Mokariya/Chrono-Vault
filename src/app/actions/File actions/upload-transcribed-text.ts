"use server"

import { createClient } from "@/lib/supabase/server"
import { parseStringify } from "@/lib/utils"

export const uploadTranscribedText = async ({
    fileId,
    transcribedText
} : Transcription) => {

    const supabase = await createClient()

    console.log(transcribedText)

    const { data, error } = await supabase
        .from('files')
        .update({ transcription: transcribedText })
        .eq('id', fileId)

    if (error) {
        console.error('Error uploading transcription:', error.message)
        return null
    }

    return data
}