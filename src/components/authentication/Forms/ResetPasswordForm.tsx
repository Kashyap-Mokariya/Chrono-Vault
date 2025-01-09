"use client"

import React, { useId, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ResetEmailConfirmation } from '@/app/actions/auth-actions'

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address!"
    })
})


const ResetPasswordForm = ({ className }: { className?: string }) => {

    const [loading, setLoading] = useState(false)

    const toastId = useId()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Sending password reset email...", { id: toastId })

        setLoading(true)
        try {
            const { success, error } = await ResetEmailConfirmation(values)

            if (!success) {
                toast.error(String(error), { id: toastId })
                setLoading(false)
            }
            else {
                toast.success("Email sent successfully! Please check your email.", { id: toastId })
                setLoading(false)
            }

        } catch (error) {
            toast.error(String(error) || "There was an error sending the email!", { id: toastId })

        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            className='shad-input'
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className='shad-form-message' />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='w-full form-submit-button'>Reset Password</Button>
                </form>
            </Form>
        </div>
    )
}

export default ResetPasswordForm

// "use client"

// import React from "react"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"

// const formSchema = z
//     .object({
//         email: z
//             .string()
//             .email({ message: "Please enter a valid email address!" }),
//         newPassword: z
//             .string()
//             .min(8, { message: "Password must be at least 8 characters long!" }),
//         confirmPassword: z
//             .string()
//             .min(8, { message: "Password must be at least 8 characters long!" }),
//     })
//     .refine((data) => data.newPassword === data.confirmPassword, {
//         message: "Passwords do not match!",
//         path: ["confirmPassword"], // This sets the error for confirmPassword
//     })

// const ResetPasswordForm = ({ className }: { className?: string }) => {
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: "",
//             newPassword: "",
//             confirmPassword: "",
//         },
//     })

//     async function onSubmit(values: z.infer<typeof formSchema>) {
//         try {
//             console.log("Form values:", values)

//             // Call Supabase to reset password
//             const supabase = await createClient()
//             const { error } = await supabase.auth.updateUser({
//                 email: values.email,
//                 password: values.newPassword,
//             })

//             if (error) {
//                 throw new Error(error.message)
//             }

//             alert("Password reset successfully!")
//         } catch (error) {
//             console.error("Error resetting password:", error)
//             alert(error.message || "Something went wrong!")
//         }
//     }

//     return (
//         <div className={cn("grid gap-6", className)}>
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                     {/* Email Field */}
//                     <FormField
//                         control={form.control}
//                         name="email"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <div className="shad-form-item">
//                                     <FormLabel>Email</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="name@example.com"
//                                             className="shad-input"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                 </div>
//                                 <FormMessage className="shad-form-message" />
//                             </FormItem>
//                         )}
//                     />
//                     {/* New Password Field */}
//                     <FormField
//                         control={form.control}
//                         name="newPassword"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <div className="shad-form-item">
//                                     <FormLabel>New Password</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             type="password"
//                                             placeholder="Enter new password"
//                                             className="shad-input"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                 </div>
//                                 <FormMessage className="shad-form-message" />
//                             </FormItem>
//                         )}
//                     />
//                     {/* Confirm Password Field */}
//                     <FormField
//                         control={form.control}
//                         name="confirmPassword"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <div className="shad-form-item">
//                                     <FormLabel>Confirm Password</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             type="password"
//                                             placeholder="Confirm new password"
//                                             className="shad-input"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                 </div>
//                                 <FormMessage className="shad-form-message" />
//                             </FormItem>
//                         )}
//                     />
//                     {/* Submit Button */}
//                     <Button type="submit" className="w-full form-submit-button">
//                         Update Password
//                     </Button>
//                 </form>
//             </Form>
//         </div>
//     )
// }

// export default ResetPasswordForm

// "use client"

// import React, { useState, useEffect, useId } from "react"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"
// import { useSearchParams } from "next/navigation" // For reading query params
// import { createClient } from "@/lib/supabase/server"
// import { toast } from "sonner"
// import { ResetPassword } from "@/app/actions/auth-actions"

// // Email form schema
// const emailSchema = z.object({
//     email: z
//         .string()
//         .email({ message: "Please enter a valid email address!" }),
// })

// // New password form schema
// const passwordSchema = z
//     .object({
//         newPassword: z
//             .string()
//             .min(8, { message: "Password must be at least 8 characters long!" }),
//         confirmPassword: z
//             .string()
//             .min(8, { message: "Password must be at least 8 characters long!" }),
//     })
//     .refine((data) => data.newPassword === data.confirmPassword, {
//         message: "Passwords do not match!",
//         path: ["confirmPassword"], // Error is set for confirmPassword field
//     })

// const ResetPasswordForm = ({ className }: { className?: string }) => {
//     const [isVerified, setIsVerified] = useState(false)
//     const searchParams = useSearchParams()
//     const token = searchParams.get("access_token") // Get the token from query params

// const [loading, setLoading] = useState(false)

// const toastId = useId()

//     const emailForm = useForm<z.infer<typeof emailSchema>>({
//         resolver: zodResolver(emailSchema),
//         defaultValues: {
//             email: "",
//         },
//     })

//     const passwordForm = useForm<z.infer<typeof passwordSchema>>({
//         resolver: zodResolver(passwordSchema),
//         defaultValues: {
//             newPassword: "",
//             confirmPassword: "",
//         },
//     })

//     // Check if the token is valid (user email is verified)
//     useEffect(() => {
//         const verifyToken = async () => {
//             if (token) {
//                 try {
//                     const supabase = await createClient()
//                     const { data, error } = await supabase.auth.getUser(token)

//                     if (error) {
//                         console.error("Error verifying token:", error)
//                         setIsVerified(false)
//                     } else if (data) {
//                         setIsVerified(true)
//                     }
//                 } catch (err) {
//                     console.error("Error:", err)
//                 }
//             }
//         }

//         verifyToken()
//     }, [token])

//     // Submit email for reset
//     async function handleEmailSubmit(values: z.infer<typeof emailSchema>) {
//         try {
//             const supabase = await createClient()
//             const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
//                 redirectTo: `${window.location.origin}/reset-password`,
//             })

//             if (error) {
//                 throw new Error(error.message)
//             }

//             alert("Password reset email sent! Please check your inbox.")
//         } catch (error) {
//             console.error("Error sending reset email:", error)
//         }
//     }

//     // Submit new password
//     async function handlePasswordSubmit(values: z.infer<typeof passwordSchema>) {
//         try {
//             toast.loading("Creating user...", { id: toastId })

//             setLoading(true)

//             const formData = new FormData()

//             formData.append('newPassword', values.newPassword)
//             formData.append('confirmPassword', values.confirmPassword)

//             const { success, error } = await ResetPassword(formData)

//         } catch (error) {
//             console.error("Error updating password:", error)
//         }
//     }

//     return (
//         <div className={cn("grid gap-6", className)}>
//             {isVerified ? (
//                 // If email is verified, show password fields
//                 <Form {...passwordForm}>
//                     <form
//                         onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
//                         className="space-y-4"
//                     >
//                         {/* New Password Field */}
//                         <FormField
//                             control={passwordForm.control}
//                             name="newPassword"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <div className="shad-form-item">
//                                         <FormLabel>New Password</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 type="password"
//                                                 placeholder="Enter new password"
//                                                 className="shad-input"
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                     </div>
//                                     <FormMessage className="shad-form-message" />
//                                 </FormItem>
//                             )}
//                         />
//                         {/* Confirm Password Field */}
//                         <FormField
//                             control={passwordForm.control}
//                             name="confirmPassword"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <div className="shad-form-item">
//                                         <FormLabel>Confirm Password</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 type="password"
//                                                 placeholder="Confirm new password"
//                                                 className="shad-input"
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                     </div>
//                                     <FormMessage className="shad-form-message" />
//                                 </FormItem>
//                             )}
//                         />
//                         {/* Submit Button */}
//                         <Button type="submit" className="w-full form-submit-button">
//                             Update Password
//                         </Button>
//                     </form>
//                 </Form>
//             ) : (
//                 // If not verified, show email form
//                 <Form {...emailForm}>
//                     <form
//                         onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
//                         className="space-y-4"
//                     >
//                         {/* Email Field */}
//                         <FormField
//                             control={emailForm.control}
//                             name="email"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <div className="shad-form-item">
//                                         <FormLabel>Email</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 placeholder="name@example.com"
//                                                 className="shad-input"
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                     </div>
//                                     <FormMessage className="shad-form-message" />
//                                 </FormItem>
//                             )}
//                         />
//                         <Button type="submit" className="w-full form-submit-button">
//                             Reset Password
//                         </Button>
//                     </form>
//                 </Form>
//             )}
//         </div>
//     )
// }

// export default ResetPasswordForm
