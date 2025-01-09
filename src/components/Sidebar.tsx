import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
    return (
        <aside className='sidebar'>
            <Link href={"/"}>
                <Image
                    src={"/logo-full-brand.svg"}
                    alt='logo'
                    width={200}
                    height={50}
                    className='hidden h-auto lg:block'
                />
            </Link>
        </aside>
    )
}

export default Sidebar
