import Image from 'next/image'
import AuthImage from '@/public/Abstract Curves and Colors.jpeg'
import React from 'react'
import Logo from '@/components/Logo'
import AuthForm from '@/components/authentication/Forms/AuthForm'
import ChangePasswordForm from '@/components/authentication/Forms/ChangePasswordForm'

const ResetPasswordPage = () => {
    return (
        <div className='flex min-h-screen max-h-screen'>
            <section className='bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5'>
                <div className='flex max-w-[430px] flex-col justify-center space-y-12'>
                    <Image
                        src={"/assets/icons/logo-full.svg"}
                        alt='logo'
                        width={225}
                        height={85}
                        className='h-auto'
                    />

                    <div className='space-y-5 text-white'>
                        <h1 className='h1'>
                            Manage your files the best way
                        </h1>

                        <p className='body-1'>
                            This is a place where you can store all your documents
                        </p>
                    </div>
                    <Image
                        src={"/assets/images/files.png"}
                        alt='illustration'
                        width={342}
                        height={342}
                        className='transition-all hover:rotate-2 hover:scale-105'
                    />
                </div>
            </section>

            <section className='flex flex-col justify-center items-center mx-auto'>
                <div>
                    <div className='max-w-xl w-[450px] mx-auto'>
                        <ChangePasswordForm />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResetPasswordPage
