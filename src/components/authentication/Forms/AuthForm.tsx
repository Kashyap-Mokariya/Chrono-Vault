"use client"
import React, { useState } from 'react'
import LoginForm from './LoginForm'
import { Button } from '../../ui/button'
import SignUpForm from './SignUpForm'
import Link from 'next/link'
import ResetPasswordForm from './ResetPasswordForm'

const AuthForm = () => {

    const [mode, setMode] = useState("login")

    return (
        <div className='space-y-6'>
            <div className='flex flex-col text-center space-y-2'>
                <h1 className='flex form-title justify-center'>
                    {
                        mode === "reset" ? "Reset Password" : mode === "login" ? "Login" : "Sign Up"
                    }
                </h1>
                <p className='text-sm text-muted-foreground'>
                    {
                        mode === "reset" ? "Enter your email below to reset your password" : mode === "login" ? "Enter your credentials to login to your account" : "Enter your information below to create an account"
                    }
                </p>
            </div>

            <div>
                {
                    mode === "login" &&
                    <>
                        <LoginForm />

                        <div className='text-center flex justify-between'>
                            <Button variant={"link"} className='p-0' onClick={() => setMode("signup")}>
                                Create new account
                            </Button>
                            <Button variant={"link"} className='p-0' onClick={() => setMode("reset")}>
                                forgot password?
                            </Button>
                        </div>
                    </>
                }
                {
                    mode === "signup" &&
                    <>
                        <SignUpForm />

                        <div className='text-center'>
                            <Button variant={"link"} className='pt-5' onClick={() => setMode("login")}>
                                Already have an account? Login here
                            </Button>
                        </div>

                        <p className='p-5 text-center text-sm text-muted-foreground'>
                            By clicking sign up, you agree to our <Link href={"#"} className='underline underline-offset-4 hover:text-primary'>Terms of Service</Link> and <Link href={"#"} className='underline underline-offset-4 hover:text-primary'>Privacy Policy</Link>
                        </p>
                    </>
                }
                {
                    mode === "reset" &&
                    <>
                        <ResetPasswordForm />

                        <div className='text-center'>
                            <Button variant={"link"} className='pt-5' onClick={() => setMode("login")}>
                                Back to login page
                            </Button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default AuthForm
