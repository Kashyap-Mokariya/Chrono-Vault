// "use server"

// import { createClient } from "@/lib/supabase/server"

// interface AuthResponse {
//     error: string | null,
//     success: boolean,
//     data: unknown | null
// }

// export async function uploadFile(data) {
//     const supabase = await createClient()

//     const { data: { user }, error } = await supabase.auth.getUser()

//     if (!user)
//     {
//         return (
//             error: "Unauthorized",
//             success: false,
//             data: null
//         )
//     }

// }