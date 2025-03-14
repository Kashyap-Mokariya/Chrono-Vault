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
import { Login, SignUp } from '@/app/actions/auth-actions'
import { useRouter } from "next/navigation";
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required!" })
        .email({
            message: "Please enter a valid email address!"
        }),

    password: z.string()
        .min(1, { message: "Password is required!" })
        .min(8, {
            message: "Incorrect email address or password!"
        }),
})


const LoginForm = ({ className }: { className?: string }) => {

    const [loading, setLoading] = useState(false)

    const router = useRouter();

    const toastId = useId()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Signing in...", { id: toastId })

        setLoading(true)

        const formData = new FormData()

        formData.append('email', values.email)
        formData.append('password', values.password)

        try {
            const { success, error } = await Login(formData)

            if (!success) {
                toast.error(String(error), { id: toastId })
                setLoading(false)
            }
            else {
                toast.success("Signed in successfully!", { id: toastId })
                setLoading(false)
                router.push("/")
            }
        } catch (error) {
            toast.error(String(error), { id: toastId })
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
                    <Button type="submit" className='w-full form-submit-button' disabled={loading}>
                        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm
