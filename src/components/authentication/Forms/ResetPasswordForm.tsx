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