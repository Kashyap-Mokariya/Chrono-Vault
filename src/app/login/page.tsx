import Image from 'next/image'
import AuthImage from '@/public/Abstract Curves and Colors.jpeg'
import React from 'react'
import Logo from '@/components/Logo'
import AuthForm from '@/components/authentication/Forms/AuthForm'

const AuthenticationPage = () => {
    return (
        // <main className='h-screen grid grid-cols-2 relative'>
        //     <div className='relative w-full flex flex-col bg-muted p-10 text-primary-foreground'>
        //         <div className='w-full h-[40%] bg-gradient-to-t from-transparent to-black/70 absolute top-0 left-0 z-10' />
        //         <div className='w-full h-[50%] bg-gradient-to-b from-transparent to-black/70 absolute bottom-0 left-0 z-10' />

        //         {/* <Image
        //             src={AuthImage}
        //             alt='Login Image'
        //             fill
        //             className='w-full h-full object-cover'
        //         /> */}

        //         <div className='relative z-20 flex items-center'>
        //             <Logo />
        //         </div>

        //         <div className='relative z-20 mt-auto'>
        //             <blockquote className='space-y-2'>
        //                 <p className='text-lg'>
        //                     &ldquo;Art Genesis AI is a game changer for me. I have been able to generate high quality professional headshots within minutes. It has saved me countless hours of work and cost as well.&rdquo;
        //                 </p>
        //             </blockquote>
        //         </div>
        //     </div>

        //     <div className='flex flex-col items-center justify-center p-8 h-full w-full'>
        //         <div className='max-w-xl w-[350px] mx-auto'>
        //             <AuthForm />
        //         </div>
        //     </div>
        // </main>

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
                        <AuthForm />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AuthenticationPage
