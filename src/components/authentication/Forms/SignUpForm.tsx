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
import { SignUp } from '@/app/actions/auth-actions'
import { redirect } from 'next/navigation'

const passValidationRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})`)

const formSchema = z.object({
    fullName: z.string()
        .min(1, { message: "Name is required!" })
        .min(3, {
            message: "Name must be at least 3 characters long!"
        }),

    email: z.string()
        .min(1, { message: "Email is required!" })
        .email({
            message: "Please enter a valid email address!"
        }),

    password: z.string()
        .min(1, { message: "Password is required!" })
        .min(8, {
            message: "Password must be at least 8 characters long!"
        })
        .regex(
            passValidationRegex, {
            message: "Password must contain 8 characters, 1 Uppercase letter, 1 Lowercase letter, 1 Number and 1 Special character"
        }
        ),

    confirmPassword: z.string({
        required_error: "Confirm your password!",
    })
}).refine(data => data.password === data.confirmPassword, {
    message: "Incorrect password",
    path: ["confirmPassword"]
})

const SignUpForm = ({ className }: { className?: string }) => {

    const [loading, setLoading] = useState(false)

    const toastId = useId()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Creating user...", { id: toastId })

        setLoading(true)

        const formData = new FormData()

        formData.append('fullName', values.fullName)
        formData.append('email', values.email)
        formData.append('password', values.password)
        formData.append('confirmPassword', values.confirmPassword)

        const { success, error } = await SignUp(formData)

        if (!success) {
            toast.error(String(error), { id: toastId })
            setLoading(false)
        }
        else {
            toast.success("User created successfully!", { id: toastId })
            setLoading(false)
            redirect("/login")
        }

    }

    return (
        <div className={cn("grid gap-6", className)}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your full name"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>Email</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>Password</FormLabel>
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
                                    <FormLabel>Confirm Password</FormLabel>
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
                        Sign Up
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default SignUpForm
