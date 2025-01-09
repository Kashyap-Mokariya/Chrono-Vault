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
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"
import { ChangePassword } from '@/app/actions/auth-actions'
import { useRouter } from "next/navigation";

const passValidationRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})`)

const formSchema = z.object({
    newPassword: z.string()
        .min(1, { message: "Password is required!" })
        .min(8, {
            message: "Password must be at least 8 characters long!"
        })
        .regex(
            passValidationRegex, {
            message: "Password must contain 8 characters, 1 Uppercase letter, 1 Lowercase letter, 1 Number and 1 Special character"
        }
        ),

    confirmPassword: z.string()
        .min(1, { message: "Password is required!" })
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Incorrect password",
    path: ["confirmPassword"]
})

const ChangePasswordForm = ({ className }: { className?: string }) => {

    const [loading, setLoading] = useState(false)

    const router = useRouter();

    const toastId = useId()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        toast.loading("Changing password...", { id: toastId })

        setLoading(true)

        try {

            const { success, error } = await ChangePassword(values.newPassword)

            if (!success) {
                toast.error(String(error), { id: toastId })
                setLoading(false)
            }
            else {
                toast.success("Password updated successfully! You can now login using your new password.", { id: toastId })
                setLoading(false)
                router.push("/login")
            }
        } catch (error) {
            toast.error(String(error), { id: toastId })
            console.log(error)
        }
        finally {
            setLoading(false)
        }

    }

    return (
        <div className={cn("grid gap-6", className)}>
            <div className='flex flex-col text-center space-y-2'>
                <h1 className='flex form-title justify-center'>
                    Change Password
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Enter a new password below to change/update your password
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder="Enter your password"
                                            className='shad-input'
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className='shad-form-message' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder="Confirm your password"
                                            className='shad-input'
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className='shad-form-message' />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='w-full form-submit-button' disabled={loading}>
                        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        {loading ? "Changing password..." : "Change password"}
                    </Button>
                    <div className='text-sm text-muted-foreground text-center'>
                        Make sure to remember your new password or store it securely
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ChangePasswordForm
